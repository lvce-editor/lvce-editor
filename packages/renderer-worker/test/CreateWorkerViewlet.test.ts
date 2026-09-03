import { expect, jest, test } from '@jest/globals'
import { createWorkerViewletWithDependencies } from '../src/parts/CreateWorkerViewlet/CreateWorkerViewlet.js'
import { getWorkerViewletAdapter } from '../src/parts/WorkerViewletAdapterMap/WorkerViewletAdapterMap.js'
import { getWorkerViewletConfig } from '../src/parts/WorkerViewletConfig/WorkerViewletConfig.js'

const stateParameter = (name: string) => ({ name, source: 'state' })
const resultParameter = (name: string) => ({ name, source: 'result' })

const createConfig = (overrides: Record<string, unknown> = {}) => ({
  capabilities: { events: true, render: true, resize: true, rootRender: true },
  commandPrefix: 'Example',
  methods: {
    create: { name: 'Example.create3', parameters: [stateParameter('uid'), stateParameter('platform')] },
    diff: { name: 'Example.diff3', parameters: [stateParameter('uid')] },
    getCommandIds: { name: 'Example.getCommandIds', parameters: [] },
    getKeyBindings: { name: 'Example.getKeyBindings', parameters: [] },
    loadContent: {
      name: 'Example.loadContent2',
      parameters: [stateParameter('uid'), { name: 'savedState', source: 'argument' }],
    },
    render: { name: 'Example.render3', parameters: [stateParameter('uid'), resultParameter('diff')] },
    renderEventListeners: { name: 'Example.renderEventListeners', parameters: [] },
    resize: { name: 'Example.resize', parameters: [stateParameter('uid'), { name: 'dimensions', source: 'argument' }] },
    saveState: { name: 'Example.saveState', parameters: [stateParameter('uid')] },
    terminate: { name: 'Example.terminate', parameters: [] },
  },
  name: 'Example',
  renderComparison: 'emptyCommands',
  state: { contextFields: ['platform'], fields: ['uri', 'x', 'y', 'width', 'height'], idKey: 'uid' },
  ...overrides,
})

test('runs configured legacy lifecycle methods with positional parameters', async () => {
  const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
    if (method === 'Example.diff3') {
      return ['diff']
    }
    if (method === 'Example.render3') {
      return [['setText', 'ready']]
    }
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({
    config: createConfig(),
    context: { platform: 2 },
    worker: { invoke, restart: jest.fn() },
  })
  const state = viewlet.create(7, 'test://example', 1, 2, 300, 200)
  const result = await viewlet.loadContent(state, { value: 'saved' })

  expect(state).toEqual({
    commands: [],
    height: 200,
    platform: 2,
    uid: 7,
    uri: 'test://example',
    width: 300,
    x: 1,
    y: 2,
  })
  expect(invoke).toHaveBeenNthCalledWith(1, 'Example.create3', 7, 2)
  expect(invoke).toHaveBeenNthCalledWith(2, 'Example.loadContent2', 7, { value: 'saved' })
  expect(invoke).toHaveBeenNthCalledWith(3, 'Example.diff3', 7)
  expect(invoke).toHaveBeenNthCalledWith(4, 'Example.render3', 7, ['diff'])
  expect(result).toEqual({ ...state, commands: [['setText', 'ready']] })
})

test('passes test mode to the explorer worker', async () => {
  const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
    if (method === 'Explorer.diff2' || method === 'Explorer.render2') {
      return []
    }
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({
    config: getWorkerViewletConfig('explorer'),
    context: { assetDir: 'test://assets', isTest: true, platform: 2 },
    worker: { invoke, restart: jest.fn() },
  })
  const state = viewlet.create(7, 'test://explorer', 1, 2, 300, 200, undefined, 5)

  await viewlet.loadContent(state, undefined)

  expect(invoke.mock.calls[0]).toEqual(['Explorer.create', 7, 'test://explorer', 1, 2, 300, 200, null, 5, 2, 'test://assets', true])
})

test('exposes the configured workspace change behavior', () => {
  const viewlet = createWorkerViewletWithDependencies({
    config: createConfig({ workspaceChangeEvent: 'workspace.titleChange', workspaceChangeEventPrepend: true }),
    worker: { invoke: jest.fn(), restart: jest.fn() },
  })

  expect(viewlet.workspaceChangeEvent).toBe('workspace.titleChange')
  expect(viewlet.workspaceChangeEventPrepend).toBe(true)
})

test('exposes the direct event rpc id on direct-render viewlets', () => {
  const viewlet = createWorkerViewletWithDependencies({
    config: createConfig({ capabilities: { directRender: true, events: true, render: true, resize: true, rootRender: true } }),
    worker: { invoke: jest.fn(), restart: jest.fn() },
  })

  expect(viewlet.Commands.__directEventRpcId).toBe('Example')
  expect(Object.keys(viewlet.Commands)).not.toContain('__directEventRpcId')
})

test('configures immediate workspace feedback for the title bar and main area', () => {
  expect(getWorkerViewletConfig('titleBar').workspaceChangeEvent).toBe('workspace.titleChange')
  expect(getWorkerViewletConfig('mainArea').workspaceChangeEventPrepend).toBe(true)
})

test('disposes preview worker state when the preview viewlet closes', async () => {
  const invoke = jest.fn(async (..._args: readonly unknown[]) => undefined)
  const viewlet = createWorkerViewletWithDependencies({
    config: getWorkerViewletConfig('preview'),
    worker: { invoke, restart: jest.fn() },
  })

  await viewlet.dispose!({ uid: 7 })

  expect(invoke).toHaveBeenCalledWith('Preview.dispose', 7)
})

test('creates command wrappers through the same lifecycle seam', async () => {
  const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
    if (method === 'Example.getCommandIds') {
      return ['select']
    }
    if (method === 'Example.diff3') {
      return ['diff']
    }
    if (method === 'Example.render3') {
      return [['setText', 'selected']]
    }
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({ config: createConfig(), context: { platform: 1 }, worker: { invoke, restart: jest.fn() } })
  const commands = await viewlet.getCommands!()
  const state = viewlet.create(9, '', 0, 0, 0, 0)
  const result = await commands.select(state, 'item-1')

  expect(invoke).toHaveBeenNthCalledWith(2, 'Example.select', 9, 'item-1')
  expect(result.commands).toEqual([['setText', 'selected']])
})

test('text search command wrappers discard superseded render pipelines', async () => {
  const { promise: firstDiff, resolve: resolveFirstDiff } = Promise.withResolvers<void>()
  const { promise: firstDiffStarted, resolve: resolveFirstDiffStarted } = Promise.withResolvers<void>()
  const invoke = jest.fn(async (method: string, _uid?: number, value?: string) => {
    if (method === 'Example.getCommandIds') {
      return ['update']
    }
    if (method === 'TextSearch.diff2') {
      if (value === 'first') {
        resolveFirstDiffStarted()
        await firstDiff
      }
      return ['latest']
    }
    if (method === 'TextSearch.render2') {
      return [['setText', 'latest']]
    }
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({
    adapter: getWorkerViewletAdapter('textSearchView'),
    config: createConfig(),
    context: { platform: 1 },
    worker: { invoke, restart: jest.fn() },
  })
  const commands = await viewlet.getCommands!()
  const state = viewlet.create(9, '', 0, 0, 0, 0)

  const first = commands.update(state, 'first')
  await firstDiffStarted
  const second = commands.update(state, 'second')
  const secondResult = await second
  resolveFirstDiff()
  const firstResult = await first

  expect(secondResult.commands).toEqual([['setText', 'latest']])
  expect(firstResult).toBe(state)
  expect(invoke.mock.calls.filter(([method]) => method === 'TextSearch.diff2')).toHaveLength(2)
  expect(invoke.mock.calls.filter(([method]) => method === 'TextSearch.render2')).toHaveLength(1)
})

test('recomputes configured outputs after commands', async () => {
  const config: any = createConfig()
  config.outputs = [{ method: { name: 'Example.renderActions', parameters: [stateParameter('uid')] }, stateField: 'actionsDom' }]
  const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
    if (method === 'Example.getCommandIds') {
      return ['select']
    }
    if (method === 'Example.diff3') {
      return ['diff']
    }
    if (method === 'Example.render3') {
      return [['setText', 'selected']]
    }
    if (method === 'Example.renderActions') {
      return [['enabled-button']]
    }
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({ config, context: { platform: 1 }, worker: { invoke, restart: jest.fn() } })
  const commands = await viewlet.getCommands!()
  const state = { ...viewlet.create(9, '', 0, 0, 0, 0), actionsDom: [['disabled-button']] }

  const result = await commands.select(state, 'item-1')

  expect(invoke).toHaveBeenCalledWith('Example.renderActions', 9)
  expect(result.actionsDom).toEqual([['enabled-button']])
})

test('renders pending worker state without replaying a command', async () => {
  const invoke = jest.fn(async (method: string) => {
    if (method === 'Example.diff3') {
      return ['diff']
    }
    if (method === 'Example.render3') {
      return [['setText', 'updated']]
    }
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({ config: createConfig(), context: { platform: 1 }, worker: { invoke, restart: jest.fn() } })
  const state = viewlet.create(9, '', 0, 0, 0, 0)

  const result = await viewlet.Commands.__renderPending(state)

  expect(Object.keys(viewlet.Commands)).not.toContain('__renderPending')
  expect(invoke.mock.calls).toEqual([
    ['Example.diff3', 9],
    ['Example.render3', 9, ['diff']],
  ])
  expect(result.commands).toEqual([['setText', 'updated']])
})

test('returns preview runtime diagnostics without treating them as viewlet state', async () => {
  const diagnostics = {
    entries: [{ level: 'error', message: 'addPipe is not defined', type: 'exception' }],
    errorCount: 1,
  }
  const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
    if (method === 'Preview.getCommandIds') {
      return ['getRuntimeDiagnostics']
    }
    if (method === 'Preview.getRuntimeDiagnostics') {
      return diagnostics
    }
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({
    adapter: getWorkerViewletAdapter('preview'),
    config: getWorkerViewletConfig('preview'),
    worker: { invoke, restart: jest.fn() },
  })
  const commands = await viewlet.getCommands!()
  const state = viewlet.create(12, 'file:///workspace/index.html', 0, 0, 640, 480)

  expect(commands.getRuntimeDiagnostics.returnValue).toBe(true)
  await expect(commands.getRuntimeDiagnostics(state)).resolves.toBe(diagnostics)
  expect(invoke).toHaveBeenCalledWith('Preview.getRuntimeDiagnostics', 12)
})

test('gets and sets authoritative worker component state', async () => {
  const config: any = createConfig()
  config.methods.getComponentState = { name: 'Example.getComponentState', parameters: [stateParameter('uid')] }
  config.methods.setComponentState = {
    name: 'Example.setComponentState',
    parameters: [stateParameter('uid'), { name: 'componentState', source: 'argument' }],
  }
  const componentState = { selectedIndex: 2, uid: 9 }
  const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
    if (method === 'Example.getComponentState') {
      return componentState
    }
    if (method === 'Example.diff3') {
      return ['dom']
    }
    if (method === 'Example.render3') {
      return [['setText', 'updated']]
    }
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({ config, context: { platform: 1 }, worker: { invoke, restart: jest.fn() } })
  const state = viewlet.create(9, '', 0, 0, 100, 100)

  await expect(viewlet.getComponentState!(state)).resolves.toBe(componentState)
  const result = await viewlet.setComponentState!(state, componentState)

  expect(invoke).toHaveBeenCalledWith('Example.setComponentState', 9, componentState)
  expect(result.commands).toEqual([['setText', 'updated']])
})

test('returns the main-area dirty-tab status without treating it as viewlet state', async () => {
  const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
    if (method === 'MainArea.getCommandIds') {
      return ['hasDirtyTabs']
    }
    if (method === 'MainArea.hasDirtyTabs') {
      return true
    }
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({
    adapter: getWorkerViewletAdapter('mainArea'),
    config: getWorkerViewletConfig('mainArea'),
    context: { assetDir: '/test', platform: 1 },
    worker: { invoke, restart: jest.fn() },
  })
  const commands = await viewlet.getCommands!()
  const state = viewlet.create(13, '', 0, 0, 640, 480)

  expect(commands.hasDirtyTabs.returnValue).toBe(true)
  await expect(commands.hasDirtyTabs(state)).resolves.toBe(true)
  expect(invoke).toHaveBeenCalledWith('MainArea.hasDirtyTabs', 13)
})

test('forwards preview bounds changes to the preview worker', async () => {
  const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
    if (method === 'Preview.diff2' || method === 'Preview.render2') {
      return []
    }
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({
    adapter: getWorkerViewletAdapter('preview'),
    config: getWorkerViewletConfig('preview'),
    worker: { invoke, restart: jest.fn() },
  })
  const state = viewlet.create(12, 'file:///workspace/index.html', 926, 29, 926, 906)
  const dimensions = { height: 906, width: 400, x: 1452, y: 29 }

  const result = await viewlet.resize!(state, dimensions)

  expect(invoke).toHaveBeenCalledWith('Preview.resize', 12, dimensions)
  expect(result).toMatchObject(dimensions)
})

test('forwards search bounds changes to the text search worker', async () => {
  const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
    if (method === 'TextSearch.diff2' || method === 'TextSearch.render2') {
      return []
    }
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({
    adapter: getWorkerViewletAdapter('textSearchView'),
    config: getWorkerViewletConfig('textSearchView'),
    context: { assetDir: 'test://assets', platform: 2, workspacePath: '/test' },
    worker: { invoke, restart: jest.fn() },
  })
  const state = viewlet.create(7, 'test://search', 182, 64, 170, 698)
  const dimensions = { height: 698, width: 252, x: 100, y: 64 }

  const result = await viewlet.resize!(state, dimensions)

  expect(invoke.mock.calls).toEqual([
    ['TextSearch.handleResize', 7, 100, 64, 252, 698],
    ['TextSearch.diff2', 7],
    ['TextSearch.render2', 7, []],
    ['TextSearch.renderActions', 7],
  ])
  expect(result).toMatchObject(dimensions)
})

test('preserves command short-circuit and phase-specific diff parameters', async () => {
  const config: any = createConfig({ commandSkipRenderWhenDiffEmpty: true })
  config.methods.commandDiff = {
    name: 'Example.commandDiff',
    parameters: [stateParameter('uid'), { name: 'args', source: 'argument', spread: true }],
  }
  const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
    if (method === 'Example.getCommandIds') return ['select']
    if (method === 'Example.commandDiff') return []
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({ config, context: { platform: 1 }, worker: { invoke, restart: jest.fn() } })
  const commands = await viewlet.getCommands!()
  const state = viewlet.create(5)

  await expect(commands.select(state, 'item-1')).resolves.toBe(state)
  expect(invoke).toHaveBeenCalledWith('Example.commandDiff', 5, 'item-1')
  expect(invoke).not.toHaveBeenCalledWith('Example.render3', 5, [])
})

test('resizes, saves, and hot reloads through configured methods', async () => {
  const restart = jest.fn(async (_method: string) => {})
  const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
    if (method === 'Example.saveState') {
      return { value: 'saved' }
    }
    if (method === 'Example.diff3') {
      return []
    }
    if (method === 'Example.render3') {
      return []
    }
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({ config: createConfig(), context: { platform: 1 }, worker: { invoke, restart } })
  const state = viewlet.create(3, '', 0, 0, 100, 100)

  await expect(viewlet.saveState!(state)).resolves.toEqual({ value: 'saved' })
  await expect(viewlet.resize!(state, { height: 60, width: 80 })).resolves.toMatchObject({ height: 60, width: 80 })
  await expect(viewlet.hotReload!(state)).resolves.toMatchObject({ isHotReloading: false })
  expect(restart).toHaveBeenCalledWith('Example.terminate')
})

test('rejects invalid parameter sources with a descriptive error', () => {
  const config = createConfig()
  config.methods.create.parameters = [{ name: 'uid', source: 'unknown' }]
  expect(() =>
    createWorkerViewletWithDependencies({ config, worker: { invoke: jest.fn(async (..._args: readonly unknown[]) => undefined) } }),
  ).toThrow('invalid test viewlet create parameter source: unknown')
})

test('creates independent state from configured defaults', () => {
  const config = createConfig({ state: { defaults: { items: [{ value: 1 }] }, idKey: 'uid' } })
  const viewlet = createWorkerViewletWithDependencies({ config, worker: { invoke: jest.fn(), restart: jest.fn() } })
  const first = viewlet.create(1)
  const second = viewlet.create(2)

  first.items[0].value = 2
  expect(second.items).toEqual([{ value: 1 }])
})

test('resolves output, menu, event, and dispose methods from descriptors', async () => {
  const config: any = createConfig()
  config.methods.dispose = { name: 'Example.dispose', parameters: [stateParameter('uid')] }
  config.methods.getMenuEntries = {
    name: 'Example.getMenuEntries',
    parameters: [{ name: 'args', source: 'argument', spread: true }],
  }
  config.methods.getMenuEntryIds = { name: 'Example.getMenuEntryIds', parameters: [] }
  config.outputs = [{ method: { name: 'Example.renderActions', parameters: [stateParameter('uid')] }, stateField: 'actionsDom' }]
  const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
    if (method === 'Example.diff3') return []
    if (method === 'Example.render3') return []
    if (method === 'Example.renderActions') return [['button']]
    if (method === 'Example.getMenuEntryIds') return [17]
    if (method === 'Example.getMenuEntries') return ['entry']
    if (method === 'Example.renderEventListeners') return ['listener']
    return undefined
  })
  const viewlet = createWorkerViewletWithDependencies({ config, context: { platform: 1 }, worker: { invoke, restart: jest.fn() } })
  const state = viewlet.create(4)
  const loaded = await viewlet.loadContent(state, {})
  const menus = await viewlet.getMenus!()

  expect(loaded.actionsDom).toEqual([['button']])
  await expect(menus[0].getMenuEntries('context', 2)).resolves.toEqual(['entry'])
  expect(invoke).toHaveBeenCalledWith('Example.getMenuEntries', 'context', 2)
  await expect(viewlet.renderEventListeners!()).resolves.toEqual(['listener'])
  await viewlet.dispose!(state)
  expect(invoke).toHaveBeenCalledWith('Example.dispose', 4)
})

test('guards hot reload re-entry and propagates rpc errors', async () => {
  const invoke = jest.fn(async () => {
    throw new Error('rpc failed')
  })
  const viewlet = createWorkerViewletWithDependencies({
    config: createConfig(),
    context: { platform: 1 },
    worker: { invoke, restart: jest.fn() },
  })

  await expect(viewlet.hotReload!({ isHotReloading: true, uid: 1 })).resolves.toEqual({ isHotReloading: true, uid: 1 })
  expect(invoke).not.toHaveBeenCalled()
  await expect(viewlet.loadContent({ platform: 1, uid: 1 }, {})).rejects.toThrow('rpc failed')
})

test('reports unknown workers and workers without viewlet metadata', () => {
  expect(() => getWorkerViewletConfig('missing-worker')).toThrow('worker not found: missing-worker')
  expect(() => getWorkerViewletConfig('authWorker')).toThrow('viewlet configuration not found: authWorker')
})
