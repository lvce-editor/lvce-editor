import { beforeEach, expect, jest, test } from '@jest/globals'

const commandExecute = jest.fn()
const panelWorkerInvocations: any[] = []

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: commandExecute,
  }
})

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

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')

beforeEach(() => {
  commandExecute.mockClear()
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

test('adds a focused terminal without reselecting the active terminal panel view', async () => {
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

  const result = await ViewletLayout.openIntegratedTerminal(state, 'file:///workspace/folder')

  expect(result.newState.panelView).toBe('Terminals')
  expect(panelWorkerInvocations).toEqual([])
  expect(commandExecute).toHaveBeenCalledWith('Terminals.addTerminal', 'file:///workspace/folder')
})

test.each([
  ['openProblems', 'Problems', 'Problems.handleFilterInput', 'typescript'],
  ['openOutput', 'Output', 'Output.selectChannel', 'Window'],
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
