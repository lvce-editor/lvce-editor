import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn()

jest.unstable_mockModule('../src/parts/ProcessExplorerWorker/ProcessExplorerWorker.js', () => ({
  invoke,
}))

const ViewletProcessExplorer = await import('../src/parts/ViewletProcessExplorer/ViewletProcessExplorer.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('dispose - disposes process explorer worker state', async () => {
  const state = {
    uid: 7,
  }

  await ViewletProcessExplorer.dispose(state)

  expect(invoke).toHaveBeenCalledWith('ProcessExplorer.dispose', 7)
})

test('gets the live component state from the worker', async () => {
  const state = { uid: 7 }
  const componentState = { uid: 7, errorMessage: 'Live State Error' }
  invoke.mockResolvedValue(componentState as never)

  await expect(ViewletProcessExplorer.getComponentState(state)).resolves.toBe(componentState)

  expect(invoke).toHaveBeenCalledWith('ProcessExplorer.getComponentState', 7)
})

test('sets the live component state and renders the worker diff', async () => {
  const state = { uid: 7 }
  const componentState = { uid: 7, errorMessage: 'Live State Error' }
  const diff = [1]
  const commands = [['Viewlet.setDom2', 7, []]]
  invoke
    .mockResolvedValueOnce(undefined as never)
    .mockResolvedValueOnce(diff as never)
    .mockResolvedValueOnce(commands as never)

  const result = await ViewletProcessExplorer.setComponentState(state, componentState)

  expect(invoke.mock.calls).toEqual([
    ['ProcessExplorer.setComponentState', 7, componentState],
    ['ProcessExplorer.diff2', 7],
    ['ProcessExplorer.render2', 7, diff],
  ])
  expect(result.commands).toEqual(commands)
})
