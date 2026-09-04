import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Platform from '../Platform/Platform.js'
import * as WorkerInvokerMap from '../WorkerInvokerMap/WorkerInvokerMap.js'
import * as WorkerViewletAdapterMap from '../WorkerViewletAdapterMap/WorkerViewletAdapterMap.js'
import * as WorkerViewletConfig from '../WorkerViewletConfig/WorkerViewletConfig.js'
import * as Workspace from '../Workspace/Workspace.js'

const createContext = (getPlatform) => ({
  assetDir: AssetDir.assetDir,
  get isTest() {
    return Workspace.isTest?.() ?? false
  },
  get platform() {
    return getPlatform()
  },
  get workspacePath() {
    return Workspace.state.workspacePath
  },
  get workspaceUri() {
    return Workspace.getWorkspaceUri?.()
  },
})

const getValue = (values, name, description) => {
  if (!(name in values)) {
    throw new TypeError(`worker viewlet ${description} not found: ${name}`)
  }
  return values[name]
}

const resolveParameter = (parameter, invocation) => {
  let value
  switch (parameter.source) {
    case 'argument':
      value = invocation.arguments[parameter.name]
      break
    case 'context':
      value = invocation.context[parameter.name]
      break
    case 'literal':
      return parameter.value
    case 'result':
      value = invocation.results[parameter.name]
      break
    case 'state':
      value = invocation.state[parameter.name]
      break
    default:
      throw new TypeError(`invalid worker viewlet parameter source: ${parameter.source}`)
  }
  return parameter.index === undefined ? value : value[parameter.index]
}

const invokeConfiguredMethod = async (worker, method, invocation) => {
  const parameters = method.parameters.flatMap((parameter) => {
    const value = resolveParameter(parameter, invocation)
    return parameter.spread ? value : [value]
  })
  try {
    return await worker.invoke(method.name, ...parameters)
  } catch (error) {
    if ('fallback' in method) {
      return cloneStateValue(method.fallback)
    }
    throw error
  }
}

const cloneStateValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(cloneStateValue)
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneStateValue(item)]))
  }
  return value
}

const createInvocation = (state, context, arguments_) => ({
  arguments: arguments_ || {},
  context,
  results: {},
  state,
})

const createRender = (comparison) => {
  const renderItems = {
    isEqual(oldState, newState) {
      if (comparison === 'always') {
        return false
      }
      if (comparison === 'emptyCommands') {
        return !newState.commands || newState.commands.length === 0
      }
      return JSON.stringify(oldState.commands) === JSON.stringify(newState.commands)
    },
    apply: AdjustCommands.apply,
    multiple: true,
  }
  return [renderItems]
}

const getStateField = (viewlet, id, uri, x, y, width, height, args, parentUid, context) => {
  const standardFields = { id, uid: id, uri, x, y, width, height, args, parentUid }
  const state = {
    [viewlet.state.idKey]: id,
    commands: [],
  }
  for (const field of viewlet.state.fields || []) {
    state[field] = getValue(standardFields, field, 'create field')
  }
  for (const field of viewlet.state.contextFields || []) {
    state[field] = getValue(context, field, 'context')
  }
  return Object.assign(state, cloneStateValue(viewlet.state.defaults))
}

const createGetTitle = (methods, idKey, context, worker) => {
  if (!methods.getTitle) {
    return undefined
  }
  return (uid) => {
    const state = typeof uid === 'object' ? uid : { [idKey]: uid }
    return invokeConfiguredMethod(worker, methods.getTitle, createInvocation(state, context, { uid }))
  }
}

const createRenderTitle = (title) => {
  if (title === undefined) {
    return undefined
  }
  return {
    isEqual(oldState, newState) {
      return oldState.title === newState.title
    },
    apply(_oldState, newState) {
      return newState.title
    },
  }
}

const createWorkerViewletInternal = ({ adapter, config, context, worker }) => {
  const { capabilities = {}, css = [], methods, name, state, variables = [], workspaceChangeEvent, workspaceChangeEventPrepend } = config
  const Commands = {}
  const Events = {}
  const { idKey } = state
  let nextRenderInvocationId = 0
  const activeRenderInvocations = new Map()
  const renderQueues = new Map()

  const createRenderInvocation = (uid) => {
    const invocationId = ++nextRenderInvocationId
    activeRenderInvocations.set(uid, invocationId)
    return {
      finish() {
        if (activeRenderInvocations.get(uid) === invocationId) {
          activeRenderInvocations.delete(uid)
        }
      },
      isLatest() {
        return activeRenderInvocations.get(uid) === invocationId
      },
    }
  }

  const enqueueRender = async (uid, render) => {
    const previous = renderQueues.get(uid) || Promise.resolve()
    const run = async () => {
      try {
        await previous
      } catch {
        // The previous caller receives its error; later renders must still run.
      }
      return render()
    }
    const current = run()
    renderQueues.set(uid, current)
    try {
      return await current
    } finally {
      if (renderQueues.get(uid) === current) {
        renderQueues.delete(uid)
      }
    }
  }

  if (capabilities.directRender) {
    Object.defineProperty(Commands, '__directEventRpcId', {
      value: config.commandPrefix,
    })
  }

  const create = (id, uri, x, y, width, height, args, parentUid) => {
    const initialState = getStateField(config, id, uri, x, y, width, height, args, parentUid, context)
    return adapter.transformState(initialState)
  }

  const applyOutputs = async (state, invocation, isHotReload = false) => {
    const newState = { ...state }
    for (const output of config.outputs || []) {
      if (isHotReload && output.hotReload === false) {
        continue
      }
      invocation.state = newState
      invocation.results[output.stateField] = await invokeConfiguredMethod(worker, output.method, invocation)
      newState[output.stateField] = invocation.results[output.stateField]
    }
    return newState
  }

  const runRenderPipelineInternal = async (
    currentState,
    invocationArguments = {},
    diffMethod = methods.diff,
    renderMethod = methods.render,
    isHotReload = false,
  ) => {
    const invocation = createInvocation(currentState, context, invocationArguments)
    invocation.results.diff = await invokeConfiguredMethod(worker, diffMethod, invocation)
    invocation.results.commands = await invokeConfiguredMethod(worker, renderMethod, invocation)
    const renderedState = {
      ...currentState,
      commands: invocation.results.commands,
    }
    const newState = await applyOutputs(renderedState, invocation, isHotReload)
    return adapter.transformRenderedState(newState)
  }

  const runRenderPipeline = (currentState, ...args) => {
    const render = () => runRenderPipelineInternal(currentState, ...args)
    if (adapter.serializeRenderPipelines) {
      return enqueueRender(currentState[idKey], render)
    }
    return render()
  }

  const runLoadContent = async (currentState, savedState, args, createMethod, loadMethod, isHotReload) => {
    const loadState = adapter.prepareLoadState(currentState, { context, isHotReload, savedState, worker })
    const invocation = createInvocation(loadState, context, { args, savedState })
    await invokeConfiguredMethod(worker, createMethod, invocation)
    await invokeConfiguredMethod(worker, loadMethod, invocation)
    await adapter.afterLoadContent({ context, isHotReload, savedState, state: loadState, worker })
    const diffMethod = isHotReload ? methods.hotReloadDiff || methods.diff : methods.diff
    const renderMethod = isHotReload ? methods.hotReloadRender || methods.render : methods.render
    const renderedState = await runRenderPipeline(loadState, invocation.arguments, diffMethod, renderMethod, isHotReload)
    return adapter.transformLoadedState(renderedState, { context, isHotReload, savedState, worker })
  }

  const loadContent = (currentState, savedState, ...args) => {
    return runLoadContent(currentState, savedState, args, methods.create, methods.loadContent, false)
  }

  const runCommandRenderPipelineInternal = async (currentState, args) => {
    const invocation = createInvocation(currentState, context, { args })
    invocation.results.diff = await invokeConfiguredMethod(worker, methods.commandDiff || methods.diff, invocation)
    if (config.commandSkipRenderWhenDiffEmpty && invocation.results.diff.length === 0) {
      return currentState
    }
    invocation.results.commands = await invokeConfiguredMethod(worker, methods.commandRender || methods.render, invocation)
    if (config.commandReturnStateWhenCommandsEmpty && invocation.results.commands.length === 0) {
      return currentState
    }
    const renderedState = {
      ...currentState,
      commands: invocation.results.commands,
    }
    const newState = await applyOutputs(renderedState, invocation)
    return adapter.transformRenderedState(newState)
  }

  const runCommandRenderPipeline = (currentState, args) => {
    const render = () => runCommandRenderPipelineInternal(currentState, args)
    if (adapter.serializeRenderPipelines) {
      return enqueueRender(currentState[idKey], render)
    }
    return render()
  }

  Object.defineProperty(Commands, '__renderPending', {
    value(currentState) {
      return runCommandRenderPipeline(currentState, [])
    },
  })

  const wrapCommand = (command) => {
    return async (currentState, ...args) => {
      await worker.invoke(`${config.commandPrefix}.${command}`, currentState[idKey], ...args)
      return runCommandRenderPipeline(currentState, args)
    }
  }

  const createCommandWrapper = (command) => {
    return adapter.wrapCommand(command, wrapCommand, { context, createRenderInvocation, enqueueRender, worker })
  }

  const wrapConfiguredCommand = (methodName) => {
    return async (currentState, ...args) => {
      const invocation = createInvocation(currentState, context, { args })
      await invokeConfiguredMethod(worker, methods[methodName], invocation)
      return runCommandRenderPipeline(currentState, args)
    }
  }

  const extraCommandFunctions = {}
  for (const command of config.extraCommands || []) {
    extraCommandFunctions[command.name] = wrapConfiguredCommand(command.method)
  }

  const getCommands = methods.getCommandIds
    ? async () => {
        const commandIds = await invokeConfiguredMethod(worker, methods.getCommandIds, createInvocation({}, context))
        for (const commandId of commandIds) {
          Commands[commandId] = createCommandWrapper(commandId)
        }
        for (const command of config.extraCommands || []) {
          Commands[command.name] = extraCommandFunctions[command.name]
        }
        adapter.extendCommands(Commands, workerViewlet, { context, worker })
        if (workerViewlet.hotReload) {
          Commands.hotReload = workerViewlet.hotReload
        }
        return Commands
      }
    : undefined

  const getKeyBindings = methods.getKeyBindings
    ? async () => {
        try {
          return await invokeConfiguredMethod(worker, methods.getKeyBindings, createInvocation({}, context))
        } catch (error) {
          if (config.ignoreKeyBindingErrors) {
            return []
          }
          throw error
        }
      }
    : undefined
  const getQuickPickMenuEntries = methods.getQuickPickMenuEntries
    ? () => invokeConfiguredMethod(worker, methods.getQuickPickMenuEntries, createInvocation({}, context))
    : undefined
  const getMenus =
    methods.getMenuEntryIds && methods.getMenuEntries
      ? async () => {
          try {
            const ids = await invokeConfiguredMethod(worker, methods.getMenuEntryIds, createInvocation({}, context))
            return ids.map((id) => ({
              id,
              getMenuEntries(...args) {
                return invokeConfiguredMethod(worker, methods.getMenuEntries, createInvocation({}, context, { args }))
              },
            }))
          } catch {
            return []
          }
        }
      : undefined
  const dynamicTitle = createGetTitle(methods, idKey, context, worker)
  let getTitle = dynamicTitle
  if (!getTitle && config.title !== undefined) {
    getTitle = () => config.title
  }
  const getStorageKey = config.storageKeyField ? (currentState) => currentState[config.storageKeyField] : undefined
  const renderTitle = createRenderTitle(config.title)
  const renderEventListeners = methods.renderEventListeners
    ? async () => {
        try {
          return await invokeConfiguredMethod(worker, methods.renderEventListeners, createInvocation({}, context))
        } catch (error) {
          if (config.ignoreEventListenerErrors) {
            return []
          }
          throw error
        }
      }
    : undefined
  const saveState = methods.saveState
    ? (currentState) => invokeConfiguredMethod(worker, methods.saveState, createInvocation(currentState, context))
    : undefined
  const getComponentState = methods.getComponentState
    ? (currentState) => invokeConfiguredMethod(worker, methods.getComponentState, createInvocation(currentState, context))
    : undefined
  const setComponentState = methods.setComponentState
    ? async (currentState, componentState) => {
        const invocation = createInvocation(currentState, context, { componentState })
        await invokeConfiguredMethod(worker, methods.setComponentState, invocation)
        return runCommandRenderPipeline(currentState, [])
      }
    : undefined
  const dispose = methods.dispose
    ? (currentState) => invokeConfiguredMethod(worker, methods.dispose, createInvocation(currentState, context))
    : undefined

  let resize
  if (methods.resize) {
    resize = async (currentState, dimensions) => {
      const invocation = createInvocation(currentState, context, { dimensions })
      await invokeConfiguredMethod(worker, methods.resize, invocation)
      return runRenderPipeline({ ...currentState, ...dimensions }, invocation.arguments)
    }
  } else if (config.stateResize) {
    resize = (currentState, dimensions) => ({ ...currentState, ...dimensions })
  }

  const renderActions = (config.outputs || []).some((output) => output.stateField === 'actionsDom')
    ? {
        isEqual(oldState, newState) {
          if (config.renderActionsComparison === 'always') {
            return false
          }
          return JSON.stringify(oldState.actionsDom) === JSON.stringify(newState.actionsDom)
        },
        apply(_oldState, newState) {
          return newState.actionsDom
        },
      }
    : undefined

  let hotReload
  if (methods.terminate) {
    hotReload = async (currentState) => {
      if (currentState.isHotReloading) {
        return currentState
      }
      const savedState = await adapter.getHotReloadSavedState(currentState, saveState)
      await worker.restart(methods.terminate.name)
      const loadingState = adapter.prepareHotReloadState({ ...currentState, isHotReloading: true })
      const newState = await runLoadContent(
        loadingState,
        savedState,
        [],
        methods.hotReloadCreate || methods.create,
        methods.hotReloadLoadContent || methods.loadContent,
        true,
      )
      return {
        ...newState,
        isHotReloading: false,
      }
    }
  }

  const workerViewlet = {
    Commands,
    Css: css,
    Events,
    Variables: variables,
    create,
    dispose,
    getCommands,
    getComponentState,
    getKeyBindings,
    getQuickPickMenuEntries,
    getMenus,
    getStorageKey,
    getTitle,
    hasDirectRender: Boolean(capabilities.directRender),
    hasFunctionalEvents: Boolean(capabilities.events),
    hasFunctionalRender: Boolean(capabilities.render),
    hasFunctionalResize: Boolean(capabilities.resize),
    hasFunctionalRootRender: Boolean(capabilities.rootRender),
    hotReload,
    loadContent,
    menus: [],
    name,
    render: createRender(config.renderComparison),
    renderEventListeners,
    renderActions,
    renderTitle,
    resize,
    saveState,
    setComponentState,
    workspaceChangeEvent,
    workspaceChangeEventPrepend,
  }
  workerViewlet.renderContent = workerViewlet.render[0]
  workerViewlet.renderDialog = workerViewlet.render[0]
  workerViewlet.renderItems = workerViewlet.render[0]
  return Object.assign(
    workerViewlet,
    extraCommandFunctions,
    adapter.extendModule(workerViewlet, { context, worker, wrapCommand: createCommandWrapper }) || undefined,
  )
}

export const createWorkerViewletWithDependencies = ({
  adapter = WorkerViewletAdapterMap.getWorkerViewletAdapter(''),
  config,
  context = {},
  worker,
}) => {
  WorkerViewletConfig.validateWorkerViewletConfig('test', config)
  return createWorkerViewletInternal({ adapter, config, context, worker })
}

export const createWorkerViewlet = ({ workerId, getPlatform = Platform.getPlatform }) => {
  const config = WorkerViewletConfig.getWorkerViewletConfig(workerId)
  const context = createContext(getPlatform)
  const worker = WorkerInvokerMap.getWorkerInvoker(workerId)
  const adapter = WorkerViewletAdapterMap.getWorkerViewletAdapter(workerId)
  return createWorkerViewletInternal({ adapter, config, context, worker })
}
