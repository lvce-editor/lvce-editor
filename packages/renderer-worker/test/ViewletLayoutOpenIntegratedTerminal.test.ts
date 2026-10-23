import { beforeEach, expect, jest, test } from '@jest/globals'

const commandExecute = jest.fn()
const executeForApplication = jest.fn()
const executeViewletCommand = jest.fn()
const panelWorkerInvocations: any[] = []

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: commandExecute,
  }
})

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({ executeForApplication }))

jest.unstable_mockModule('../src/parts/PanelWorker/PanelWorker.js', () => {
  return {
    invoke: async (method, ...args) => {
      panelWorkerInvocations.push([method, ...args])
      switch (method) {
        case 'Panel.toggleView':
          return undefined
        case 'Panel.diff2':
        case 'Panel.render2':
          return []
        default:
          throw new Error(`unexpected panel worker method ${method}`)
      }
    },
    restart: async () => {},
  }
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ executeViewletCommand }))

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')

beforeEach(() => {
  commandExecute.mockClear()
  executeForApplication.mockClear()
  executeViewletCommand.mockReset()
  panelWorkerInvocations.length = 0
  ViewletStates.reset()
  ViewletStates.set('Panel', {
    factory: {},
    moduleId: 'Panel',
    renderedState: { uid: 77 },
    state: { uid: 77 },
  })
})

test('opens a new terminal panel view with the requested cwd', async () => {
  const state = {
    ...ViewletLayout.create(1),
    panelView: 'Problems',
    panelVisible: true,
  }

  const result = await ViewletLayout.openIntegratedTerminal(state, 'file:///workspace/folder')

  expect(result.newState.panelView).toBe('Terminals')
  expect(panelWorkerInvocations).toEqual([
    ['Panel.toggleView', 77, 'Terminals', 'file:///workspace/folder'],
    ['Panel.diff2', 77],
  ])
  expect(commandExecute).not.toHaveBeenCalled()
})

test.each([true, false])('adds a focused terminal after revealing existing terminals (panel visible: %s)', async (panelVisible) => {
  ViewletStates.set('Terminals', {
    factory: {},
    moduleId: 'Terminals',
    renderedState: { uid: 88 },
    state: { uid: 88 },
  })
  const state = {
    ...ViewletLayout.create(1),
    panelView: 'Problems',
    panelVisible: true,
  }

  state.panelVisible = panelVisible
  const result = await ViewletLayout.openIntegratedTerminal(state, 'file:///workspace/folder')

  expect(executeViewletCommand).toHaveBeenCalledWith(state.uid, 'showPanel', 'Terminals')
  expect(result.newState).toBe(state)
  expect(panelWorkerInvocations).toEqual([])
  expect(commandExecute).toHaveBeenCalledWith('Terminals.addTerminal', 'file:///workspace/folder')
})

test('adds a terminal directly when the terminal panel is active', async () => {
  ViewletStates.set('Terminals', {
    factory: {},
    moduleId: 'Terminals',
    renderedState: { uid: 88 },
    state: { uid: 88 },
  })
  const state = { ...ViewletLayout.create(1), panelView: 'Terminals', panelVisible: true }
  await ViewletLayout.openIntegratedTerminal(state, '')
  expect(executeViewletCommand).not.toHaveBeenCalled()
  expect(commandExecute).toHaveBeenCalledWith('Terminals.addTerminal', '')
})

test.each([
  ['openProblems', 'Problems', 'Problems.handleFilterInput', 'typescript'],
  ['openDebugConsole', 'Debug Console', 'ViewletDebugConsole.handleInput', 'process.version'],
] as const)('opens the requested panel view with its initial option: %s', async (method, panelView, command, value) => {
  const state = {
    ...ViewletLayout.create(1),
    panelView: 'Terminals',
    panelVisible: true,
  }

  const result = await ViewletLayout[method](state, value)

  expect(result.newState.panelView).toBe(panelView)
  expect(panelWorkerInvocations).toEqual([
    ['Panel.toggleView', 77, panelView, ''],
    ['Panel.diff2', 77],
  ])
  expect(commandExecute).toHaveBeenCalledWith(command, value)
})

test.each([
  ['openProblems', 'Problems'],
  ['openOutput', 'Output'],
  ['openDebugConsole', 'Debug Console'],
] as const)('preserves the requested panel view state when no option is supplied: %s', async (method, panelView) => {
  const state = {
    ...ViewletLayout.create(1),
    panelView: 'Terminals',
    panelVisible: true,
  }

  const result = await ViewletLayout[method](state)

  expect(result.newState.panelView).toBe(panelView)
  expect(commandExecute).not.toHaveBeenCalled()
})

test('renders the output panel before selecting the requested channel', async () => {
  const state = ViewletLayout.create(1)
  const panelRendered = Promise.withResolvers<void>()
  executeViewletCommand.mockImplementation(() => panelRendered.promise)

  const pending = ViewletLayout.openOutput(state, 'Window')

  expect(executeViewletCommand).toHaveBeenCalledWith(state.uid, 'showPanel', 'Output', 'Window')
  expect(commandExecute).not.toHaveBeenCalled()

  panelRendered.resolve()
  const result = await pending

  expect(commandExecute).toHaveBeenCalledWith('Output.selectChannel', 'Window')
  expect(result).toEqual({ newState: state, commands: [] })
})

test('selects the output channel in the application that opened the panel', async () => {
  const state = { ...ViewletLayout.create(1), applicationId: 'preview' }
  await ViewletLayout.openOutput(state, 'sample-build')
  expect(executeViewletCommand).toHaveBeenCalledWith(state.uid, 'showPanel', 'Output', 'sample-build')
  expect(executeForApplication).toHaveBeenCalledWith('preview', 'Output.selectChannel', 'sample-build')
  expect(commandExecute).not.toHaveBeenCalled()
})

test('terminal execution waits for the panel and preserves process arguments', async () => {
  const panelRendered = Promise.withResolvers<void>()
  executeViewletCommand.mockImplementation(() => panelRendered.promise)
  const state = ViewletLayout.create(1)
  const execution = { command: 'node', args: ['/workspace/a ; $(touch nope).js'], cwd: '/workspace' }
  const pending = ViewletLayout.runInTerminal(state, execution)
  expect(commandExecute).not.toHaveBeenCalled()
  panelRendered.resolve()
  await pending
  expect(commandExecute).toHaveBeenCalledWith('Terminals.addTerminal', execution.cwd, { ...execution, keepOpen: true })
})

test('terminal execution targets its owning application', async () => {
  const state = { ...ViewletLayout.create(1), applicationId: 'preview' }
  const execution = { command: 'bash', args: ['/workspace/test.sh'], cwd: '/workspace' }
  await ViewletLayout.runInTerminal(state, execution)
  expect(executeForApplication).toHaveBeenCalledWith('preview', 'Terminals.addTerminal', execution.cwd, { ...execution, keepOpen: true })
  expect(commandExecute).not.toHaveBeenCalled()
})
