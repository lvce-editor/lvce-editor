// @ts-nocheck
import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import { CancelationError } from '../Errors/CancelationError.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Id from '../Id/Id.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'
import * as MenuEntriesRegistryState from '../MenuEntriesRegistryState/MenuEntriesRegistryState.js'
import * as MouseActions from '../MouseActions/MouseActions.ts'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SaveState from '../SaveState/SaveState.js'
import { updateDynamicFocusContext } from '../UpdateDynamicFocusContext/UpdateDynamicFocusContext.js'
import * as ViewletManagerVisitor from '../ViewletManagerVisitor/ViewletManagerVisitor.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const state = {
  pendingModules: Object.create(null),
}

const ViewletState = {
  Default: 0,
  ModuleLoaded: 1,
  ContentLoaded: 2,
  RendererProcessViewletLoaded: 3,
  ContentRendered: 4,
  Appended: 5,
}

const kCreate = 'Viewlet.create'
const kCreateFunctionalRoot = 'Viewlet.createFunctionalRoot'
const kAppend = 'Viewlet.append'
const kSendMultiple = 'Viewlet.sendMultiple'
const kLoadModule = 'Viewlet.loadModule'
const kLoad = 'Viewlet.load'
const kSetBounds = 'Viewlet.setBounds'
const kAppendViewlet = 'Viewlet.appendViewlet'
const kHandleError = 'Viewlet.handleError'
const kDispose = 'Viewlet.dispose'

const shouldLoadModuleInRendererProcess = (id) => {
  return id !== ViewletModuleId.EditorText
}

const runFn = async (instance, id, key, fn, args) => {
  if (!instance) {
    console.info(`cannot execute viewlet command ${id}.${key}: no active instance for ${id}`)
    return
  }
  if (instance.factory && instance.factory.hasFunctionalRender) {
    const oldState = instance.state
    const newState = await fn(oldState, ...args)

    if (
      key === 'getActiveSideBarView' ||
      key === 'getAllQuickPickMenuEntries' ||
      key === 'getAssetDir' ||
      key === 'getBadgeCounts' ||
      key === 'getCommit' ||
      key === 'getCommitDate' ||
      key === 'getModuleId' ||
      key === 'getProductNameLong' ||
      key === 'getSideBarPosition' ||
      key === 'getSideBarVisible' ||
      key === 'getVersion' ||
      key === 'getPlatform'
    ) {
      return newState
    }
    if (!newState) {
      console.log({ fn })
    }
    Assert.object(newState)
    // console.log({ fn, newState })
    if (oldState === newState) {
      return
    }
    const commands = render(instance.factory, oldState, newState, newState.uid || id)
    updateDynamicFocusContext(commands)
    ViewletStates.setRenderedState(id, newState)
    await RendererProcess.invoke(/* Viewlet.sendMultiple */ kSendMultiple, /* commands */ commands)
  } else {
    return fn(instance.state, ...args)
  }
}

const runFnWithSideEffect = async (instance, id, key, fn, ...args) => {
  if (!instance) {
    console.info(`cannot execute viewlet command ${id}.${key}: no active instance for ${id}`)
    return
  }
  const oldState = instance.state
  const result = await fn(oldState, ...args)
  const { newState, commands } = result
  Assert.object(newState)
  const renderedState = instance.renderedState
  if (oldState !== newState) {
    commands.push(...render(instance.factory, renderedState, newState))
    ViewletStates.setRenderedState(id, newState)
  }
  if (commands.length === 0) {
    return
  }
  updateDynamicFocusContext(commands)
  await RendererProcess.invoke(/* Viewlet.sendMultiple */ kSendMultiple, /* commands */ commands)
}

// TODO maybe wrapViewletCommand should accept module instead of id string
// then check if instance.factory matches module -> only compare reference (int) instead of string
// should be faster
const wrapViewletCommand = (id, key, fn) => {
  Assert.string(id)
  Assert.fn(fn)
  if (fn.returnValue) {
    const wrappedViewletCommand = async (...args) => {
      // Get the focused instance of this type, or fall back to first instance
      const focusedUid = ViewletStates.getFocusedInstanceByType(id)
      let activeInstance
      if (focusedUid) {
        activeInstance = ViewletStates.getByUid(focusedUid)
      }
      if (!activeInstance) {
        // Fallback to first instance if none focused
        activeInstance = ViewletStates.getInstance(id)
      }
      const result = await fn(activeInstance.state, ...args)
      return result
    }
    return wrappedViewletCommand
  }
  const wrappedViewletCommand = async (...args) => {
    // Get the focused instance of this type, or fall back to first instance
    const focusedUid = ViewletStates.getFocusedInstanceByType(id)
    let activeInstance
    if (focusedUid) {
      activeInstance = ViewletStates.getByUid(focusedUid)
    }
    if (!activeInstance) {
      // Fallback to first instance if none focused
      activeInstance = ViewletStates.getInstance(id)
    }
    const result = await runFn(activeInstance, id, key, fn, args)
    return result
  }
  NameAnonymousFunction.nameAnonymousFunction(wrappedViewletCommand, `${id}/${key}`)
  return wrappedViewletCommand
}

const wrapViewletCommandWithSideEffect = (id, key, fn) => {
  const wrappedViewletCommand = async (...args) => {
    // Get the focused instance of this type, or fall back to first instance
    const focusedUid = ViewletStates.getFocusedInstanceByType(id)
    let activeInstance
    if (focusedUid) {
      activeInstance = ViewletStates.getByUid(focusedUid)
    }
    if (!activeInstance) {
      // Fallback to first instance if none focused
      activeInstance = ViewletStates.getInstance(id)
    }
    await runFnWithSideEffect(activeInstance, id, key, fn, ...args)
  }
  NameAnonymousFunction.nameAnonymousFunction(wrappedViewletCommand, key)
  return wrappedViewletCommand
}

const wrapViewletCommandLazy = (id, key, importFn) => {
  const lazyCommand = async (...args) => {
    const module = await importFn()
    const fn = module[key]
    if (typeof fn !== 'function') {
      throw new TypeError(`${id}.${key} is not a function`)
    }
    const activeInstance = ViewletStates.getInstance(id)
    await runFn(activeInstance, id, key, fn, args)
  }
  NameAnonymousFunction.nameAnonymousFunction(lazyCommand, `${id}/lazy/${key}`)
  return lazyCommand
}

const wrapViewletCommandWithSideEffectLazy = (id, key, importFn) => {
  const lazyCommand = async (...args) => {
    const module = await importFn()
    const fn = module[key]
    if (typeof fn !== 'function') {
      throw new TypeError(`${id}.${key} is not a function`)
    }
    const activeInstance = ViewletStates.getInstance(id)
    await runFnWithSideEffect(activeInstance, id, key, fn, ...args)
  }
  NameAnonymousFunction.nameAnonymousFunction(lazyCommand, `${id}/lazy/${key}`)
  return lazyCommand
}
/**
 *
 * @param {()=>any} getModule
 * @returns
 */
export const create = (getModule, id, parentUid, uri, x, y, width, height) => {
  Assert.fn(getModule)
  Assert.string(id)
  Assert.number(parentUid)
  Assert.string(uri)
  Assert.number(x)
  Assert.number(y)
  Assert.number(width)
  Assert.number(height)
  return {
    type: 0,
    getModule,
    id,
    parentUid,
    uri,
    x,
    y,
    width,
    height,
  }
}

const getRenderCommands = (module, oldState, newState, uid = newState.uid || module.name, parentId) => {
  const commands = []
  if (module.renderActions && !module.renderActions.isEqual(oldState, newState)) {
    const actionsCommands = module.renderActions.apply(oldState, newState)
    if (parentId) {
      commands.push(['Viewlet.send', parentId, 'setActionsDom', actionsCommands, uid])
    } else {
      // TODO
      // console.warn('parent id not found')
    }
  }

  if (module.renderTitle && !module.renderTitle.isEqual(oldState, newState)) {
    const title = module.renderTitle.apply(oldState, newState)
    if (parentId) {
      // commands.push(['Viewlet.send', parentId, 'setTitle', title])
    }
  }

  if (module.getBadgeCount && parentId) {
    const badgeCount = module.getBadgeCount(newState)
    const parentInstance = ViewletStates.getInstance(parentId)
    const childInstance = ViewletStates.getInstance(uid)
    if (parentInstance && parentInstance.factory.setBadgeCount) {
      const oldState = parentInstance.state
      const newParentState = parentInstance.factory.setBadgeCount(oldState, childInstance.factory.name, badgeCount)
      ViewletStates.setState(parentId, newParentState)
      commands.push(...getRenderCommands(parentInstance.factory, oldState, newParentState))
    }
  }
  if (Array.isArray(module.render)) {
    for (const item of module.render) {
      if (!item.isEqual(oldState, newState)) {
        const command = item.apply(oldState, newState)
        if (command.length === 0) {
          continue
        }
        if (item.multiple) {
          commands.push(...command)
          continue
        }
        if (command[0] === 'Viewlet.setDom2') {
          command.splice(1, 0, uid)
        } else if (command[0] === 'Viewlet.setDom') {
          command.splice(1, 0, uid)
        } else if (command[0] !== 'Viewlet.send' && command[0] !== 'Viewlet.ariaAnnounce' && command[0] !== 'Viewlet.createFunctionalRoot') {
          command.unshift('Viewlet.send', uid)
        }
        commands.push(command)
      }
    }
    return commands
  }
  if (module.render) {
    return module.render(oldState, newState)
  }
  return commands
}

const getRenderActionCommands = (module, oldState, newState, uid = newState.uid || module.name) => {
  if (module.renderActions) {
    if (module.renderActions.isEqual(oldState, newState)) {
      return []
    }
    return module.renderActions.apply(oldState, newState)
  }
  return []
}

const getRenderTitleCommands = (module, oldState, newState, uid = newState.uid || module.name) => {
  if (module.renderTitle) {
    if (module.renderTitle.isEqual(oldState, newState)) {
      return []
    }
    return module.renderTitle.apply(oldState, newState)
  }
  return []
}

const registerWrappedCommand = (moduleName, key, wrappedCommand) => {
  if (key.startsWith(moduleName)) {
    Command.register(key, wrappedCommand)
  } else {
    // TODO rename editorText to editor
    if (moduleName === 'EditorText') {
      if (key.includes('.')) {
        Command.register(key, wrappedCommand)
      } else {
        Command.register(`Editor.${key}`, wrappedCommand)
      }
    } else {
      if (key.includes('.')) {
        Command.register(key, wrappedCommand)
      } else {
        Command.register(`${moduleName}.${key}`, wrappedCommand)
      }
    }
  }
}

const registerWrappedCommands = (object, id, wrapFn) => {
  for (const [key, value] of Object.entries(object)) {
    const wrappedCommand = wrapFn(id, key, value)
    registerWrappedCommand(id, key, wrappedCommand)
  }
}

const maybeRegisterWrappedCommands = async (id, module) => {
  if (module.Commands) {
    registerWrappedCommands(module.Commands, id, wrapViewletCommand)
  }
  if (module.getCommands) {
    const commands = await module.getCommands()
    registerWrappedCommands(commands, id, wrapViewletCommand)
  }
  if (module.CommandsWithSideEffects) {
    registerWrappedCommands(module.CommandsWithSideEffects, id, wrapViewletCommandWithSideEffect)
  }
  if (module.CommandsWithSideEffectsLazy) {
    registerWrappedCommands(module.CommandsWithSideEffectsLazy, id, wrapViewletCommandWithSideEffectLazy)
  }
  if (module.LazyCommands) {
    registerWrappedCommands(module.LazyCommands, id, wrapViewletCommandLazy)
  }
}

const maybeRegisterEvents = (module) => {
  if (module.Commands && module.Commands.handleWorkspaceChange) {
    const value = module.Commands.handleWorkspaceChange
    const handleUpdate = async (...params) => {
      const instance = ViewletStates.getInstance(module.name)
      if (!instance) {
        return
      }
      const newState = await value(instance.state, ...params)
      if (!newState) {
        throw new Error('newState must be defined')
      }
      if (module.shouldApplyNewstate && !module.shouldApplyNewState(newState)) {
        console.log('[viewlet manager] return', newState)
        return
      }
      const uid = instance.uid || instance.state.uid
      Assert.number(uid)
      const commands = render(instance.factory, instance.renderedState, newState, uid, newState.parentUid)
      instance.state = newState
      instance.renderedState = newState
      await RendererProcess.invoke(/* Viewlet.sendMultiple */ kSendMultiple, /* commands */ commands)
    }
    GlobalEventBus.addListener('workspace.change', handleUpdate)
  }

  // deprecated, use commands instead
  if (module.Events) {
    // TODO remove event listeners when viewlet is disposed
    for (const [key, value] of Object.entries(module.Events)) {
      const handleUpdate = async (...params) => {
        const instance = ViewletStates.getInstance(module.name)
        if (!instance) {
          return
        }
        const newState = await value(instance.state, ...params)
        if (!newState) {
          throw new Error('newState must be defined')
        }
        if (module.shouldApplyNewstate && !module.shouldApplyNewState(newState)) {
          console.log('[viewlet manager] return', newState)
          return
        }
        const uid = instance.uid || instance.state.uid
        Assert.number(uid)
        const commands = render(instance.factory, instance.renderedState, newState, uid, newState.parentUid)
        instance.state = newState
        instance.renderedState = newState
        await RendererProcess.invoke(/* Viewlet.sendMultiple */ kSendMultiple, /* commands */ commands)
      }
      GlobalEventBus.addListener(key, handleUpdate)
    }
  }
}

const maybeRegisterMenuEntries = async (module) => {
  if (module.menus) {
    for (const menu of module.menus) {
      if (!menu.id) {
        throw new Error('missing menu id')
      }
      MenuEntriesRegistryState.register(menu.id, menu)
    }
  }
  if (module.getMenus) {
    const menus = await module.getMenus()
    for (const menu of menus) {
      if (!menu.id) {
        throw new Error('missing menu id')
      }
      MenuEntriesRegistryState.register(menu.id, menu)
    }
  }
}

const actuallyLoadModule = async (getModule, id) => {
  if (!id) {
    throw new Error(`id must be defined`)
  }
  const module = await getModule(id)
  if (!module.hasFunctionalEvents && shouldLoadModuleInRendererProcess(id)) {
    await RendererProcess.invoke(/* Viewlet.load */ kLoadModule, /* id */ id, /* hasFunctionalEvents */ module.hasFunctionalEvents)
  }
  await ViewletManagerVisitor.loadModule(id, module)
  await maybeRegisterWrappedCommands(id, module)
  maybeRegisterEvents(module)
  await maybeRegisterMenuEntries(module)
  return module
}

const loadModule = (getModule, id) => {
  if (!(id in state.pendingModules)) {
    state.pendingModules[id] = actuallyLoadModule(getModule, id)
  }
  return state.pendingModules[id]
}

// TODO add lots of unit tests for this

export const backgroundLoad = async ({ getModule, id, x, y, width, height, props }) => {
  const module = await loadModule(getModule, id)
  const viewletState = module.create(id, '', y, x, width, height)
  const { title, uri } = await module.backgroundLoadContent(viewletState, props)
  return {
    title,
    uri,
  }
}
/**
 *
 * @param {{getModule:()=>any, type:number, id:string, disposed:boolean }} viewlet
 * @returns
 */
export const load = async (viewlet, focus = false, restore = false, restoreState = undefined) => {
  // console.time(`load/${viewlet.id}`)
  // TODO
  if (
    viewlet.id === 'Terminal' ||
    viewlet.id === 'SideBar' ||
    viewlet.id === 'TitleBar' ||
    viewlet.id === 'Panel' ||
    viewlet.id === 'ActivityBar' ||
    viewlet.id === 'Main' ||
    viewlet.id === 'StatusBar'
  ) {
    viewlet.setBounds = false
  }
  if (viewlet.type !== 0) {
    console.log('viewlet must be empty')
    throw new Error('viewlet must be empty')
  }
  const shouldRender = viewlet.render ?? true
  const shouldRenderEvents = viewlet.shouldRenderEvents ?? true
  let state = ViewletState.Default
  // @ts-ignore
  const viewletUid = viewlet.uid || Id.create()
  let module
  try {
    viewlet.type = 1
    if (viewlet.disposed) {
      return
    }

    module = await loadModule(viewlet.getModule, viewlet.id)
    if (viewlet.disposed) {
      return
    }
    const parentUid = viewlet.parentUid
    state = ViewletState.ModuleLoaded
    let x = viewlet.x
    let y = viewlet.y
    let width = viewlet.width
    let height = viewlet.height
    if (module.getPosition) {
      const position = module.getPosition()
      x = position.x
      y = position.y
      width = position.width
      height = position.height
    }

    const initialViewletState = module.create(viewletUid, viewlet.uri, x, y, width, height, viewlet.args, parentUid)

    let viewletState = initialViewletState
    viewletState.uid ||= viewletUid
    const oldVersion = viewletState.version === undefined ? undefined : ++viewletState.version
    let instanceSavedState
    if (restore) {
      instanceSavedState = await SaveState.getSavedViewletState(viewlet.id)
    } else if (restoreState) {
      instanceSavedState = restoreState
    }
    const args = viewlet.args || []
    let newState = await module.loadContent(viewletState, instanceSavedState, ...args)

    const commands = []

    if (module.renderEventListeners) {
      // TODO reuse event listeners between components
      const eventListeners = await module.renderEventListeners()
      if (shouldRenderEvents === false) {
        commands.push(['Viewlet.registerEventListeners', viewletUid, eventListeners])
      } else {
        await RendererProcess.invoke('Viewlet.registerEventListeners', viewletUid, eventListeners)
      }
    }
    if ((viewlet.visible === undefined || viewlet.visible === true) && module.show) {
      await module.show(newState)
    }
    const extraCommands = []

    if (module.getKeyBindings) {
      const keyBindings = await module.getKeyBindings(viewletUid)
      KeyBindingsState.addKeyBindings(viewlet.id, keyBindings)
    }
    if (module.Commands && module.Commands.getMouseActions) {
      const mouseActions = await module.Commands.getMouseActions(viewletUid)
      MouseActions.add(viewletUid, mouseActions)
    }

    if (module.getChildren) {
      const children = module.getChildren(newState)
      for (const child of children) {
        const childUid = child.uid || Id.create()
        const childId = child.id
        const childViewlet = {
          x: child.x,
          y: child.y,
          width: child.width,
          height: child.height,
          uid: childUid,
          id: childId,
          getModule: viewlet.getModule,
          type: 0,
          show: false,
          append: true,
          focus: false,
          parentId: viewletUid,
          parentUid: viewletUid,
          setBounds: child.setBounds,
        }
        const childCommands = await load(childViewlet, false, true, undefined)
        // @ts-ignore
        extraCommands.push(...childCommands)
      }
    }
    if (focus && module.focus) {
      newState = await module.focus(newState)
    }
    if (viewletState.version !== oldVersion) {
      newState = viewletState
      console.log('version mismatch')
      // TODO not sure if Object.assign is a good idea
      // Object.assign(viewletState, newState)
    }
    if (viewlet.disposed) {
      return
    }
    state = ViewletState.ContentLoaded
    if (viewlet.show === false) {
    } else if (shouldLoadModuleInRendererProcess(viewlet.id)) {
      await RendererProcess.invoke(/* Viewlet.loadModule */ kLoadModule, /* id */ viewlet.id)
    }
    if (viewlet.disposed) {
      // TODO unload the module from renderer process
      return
    }
    // TODO race condition: viewlet state may have been updated again in the mean time
    state = ViewletState.RendererProcessViewletLoaded

    ViewletStates.set(viewletUid, {
      state: newState,
      renderedState: viewletState,
      factory: module,
      moduleId: viewlet.moduleId || viewlet.id || '',
    })
    if (newState.badgeCount) {
      await Command.execute('Layout.handleBadgeCountChange')
    }
    if (module.hasFunctionalRootRender) {
      commands.push([kCreateFunctionalRoot, viewlet.id, viewletUid, module.hasFunctionalEvents])
    } else {
      commands.push([kCreate, viewlet.id, viewletUid])
    }
    if (viewletState !== newState && module.contentLoaded) {
      const additionalExtraCommands = await module.contentLoaded(newState)
      Assert.array(additionalExtraCommands)
      commands.push(...additionalExtraCommands)
    }

    if (module.Commands && module.Commands['loadContentLater']) {
      const commands = await module.Commands['loadContentLater'](newState)
    }

    const instanceNow = ViewletStates.getInstance(viewletUid)
    viewletState = instanceNow.renderedState
    if (module.hasFunctionalRender && shouldRender) {
      const renderCommands = getRenderCommands(module, viewletState, newState, viewletUid, parentUid)
      ViewletStates.setRenderedState(viewletUid, newState)
      commands.push(...renderCommands)
      if (viewlet.show === false) {
        const allCommands = [
          ...commands,
          ...extraCommands,
          // ['Viewlet.show', viewlet.id],
        ]
        // if (viewlet.setBounds !== false) {
        //   allCommands.splice(1, 0, [kSetBounds, viewletUid, x, y, width, height])
        // }
        if (module.contentLoadedEffects) {
          module.contentLoadedEffects(newState)
        }
        if (viewlet.append) {
          const parentUid = viewlet.parentUid
          Assert.number(parentUid)
          allCommands.push([kAppend, parentUid, viewletUid])
        }

        // TODO avoid side effect here
        // instead, let component send commands to renderer process and renderer worker
        // so that those commands are not mixed together
        updateDynamicFocusContext(allCommands)
        return allCommands
      }
      commands.push(...extraCommands)
      updateDynamicFocusContext(commands)
      await RendererProcess.invoke(/* Viewlet.sendMultiple */ kSendMultiple, /* commands */ commands)
    } else if (!module.hasFunctionalEvents && shouldRender) {
      const allCommands = [
        ...commands,
        ...extraCommands,
        // ['Viewlet.show', viewlet.id],
      ]
      if (viewlet.append) {
        const parentUid = viewlet.parentUid
        allCommands.push([kCreate, viewlet.id, viewletUid])
        allCommands.push([kAppend, parentUid, viewletUid])
      }
      if (module.contentLoadedEffects) {
        await module.contentLoadedEffects(newState)
      }
      return allCommands
    }

    if (viewlet.disposed) {
      // TODO unload the module from renderer process
      return
    }
    state = ViewletState.ContentRendered
    if (viewlet.parentUid && viewlet.show !== false) {
      await RendererProcess.invoke(/* Viewlet.append */ kAppendViewlet, /* parentUid */ viewlet.parentUid, /* id */ viewletUid, /* focus */ focus)
    }
    state = ViewletState.Appended

    if (viewlet.disposed) {
      // TODO unload the module from renderer process
      return
    }

    return commands
  } catch (error) {
    if (error && error instanceof CancelationError) {
      return
    }
    viewlet.type = 4
    const prettyError = await PrettyError.prepare(error)
    await PrettyError.print(prettyError)
    try {
      if (module && module.handleError) {
        await module.handleError(error)
        return []
      }
      const commands = []
      if (state < ViewletState.RendererProcessViewletLoaded && shouldLoadModuleInRendererProcess(viewlet.id)) {
        await RendererProcess.invoke(/* Viewlet.loadModule */ kLoadModule, /* id */ viewlet.id)
      }
      const parentUid = viewlet.parentUid
      await RendererProcess.invoke(kLoadModule, ViewletModuleId.Error)
      commands.push([kCreate, ViewletModuleId.Error, viewletUid])
      // @ts-ignore
      if (viewlet.setBounds !== false) {
        commands.push([kSetBounds, viewletUid, viewlet.x, viewlet.y, viewlet.width, viewlet.height])
      }
      if (module && module.customErrorRenderer) {
        const errorModule = await loadModule(viewlet.getModule, module.customErrorRenderer)
        const dom = await errorModule.render(error)
        await RendererProcess.invoke(kLoadModule, module.customErrorRenderer)
        commands.push([kCreate, module.customErrorRenderer, viewletUid])
        commands.push(['Viewlet.setDom2', viewletUid, dom])
        commands.push([kAppend, parentUid, viewletUid])
        // TODO
        // const errorCommands=
      } else {
        commands.push(['Viewlet.send', /* id */ viewletUid, 'setMessage', /* message */ `${error}`])
        // @ts-ignore
        if (viewlet.append) {
          commands.push([kAppend, parentUid, viewletUid])
        }
      }

      return commands
    } catch (error) {
      console.error(error)
      return []
      // this is really bad
      // probably can only show an alert at this point
    }
  }
  // console.timeEnd(`load/${viewlet.id}`)
}

export const dispose = async (id) => {
  state[id].disposed = true
  delete Viewlet.state.instances[id]
  delete state[id]
  await RendererProcess.invoke(/* Viewlet.dispose */ kDispose, /* id */ id)
}

export const mutate = async (id, fn) => {
  // TODO handle race conditions here
  const viewletState = state[id]
  await fn(state)
}

export const render = (module, oldState, newState, uid = newState.uid || module.name, parentUid = newState.parentUid) => {
  const commands = getRenderCommands(module, oldState, newState, uid, parentUid)
  return commands
}

export const renderActions = (module, oldState, newState, uid = newState.uid || module.name) => {
  return getRenderActionCommands(module, oldState, newState, uid)
}

export const renderTitle = (module, oldState, newState, uid = newState.uid || module.name) => {
  return getRenderTitleCommands(module, oldState, newState, uid)
}
