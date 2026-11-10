import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn()
const getPreference = jest.fn()

jest.unstable_mockModule('../src/parts/ProcessExplorerWorker/ProcessExplorerWorker.js', () => ({
  invoke,
}))
jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  get: getPreference,
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

test('changing preferences immediately updates the process explorer refresh interval', async () => {
  const state = { processExplorerUpdateInterval: 1000, uid: 7 }
  getPreference.mockReturnValue(2500)

  await expect(ViewletProcessExplorer.handlePreferencesChanged(state)).resolves.toEqual({ ...state, processExplorerUpdateInterval: 2500 })

  expect(invoke).toHaveBeenCalledWith('ProcessExplorer.setUpdateInterval', 7, 2500)
})

test('unrelated preference changes do not restart the process explorer refresh interval', async () => {
  const state = { processExplorerUpdateInterval: 2500, uid: 7 }
  getPreference.mockReturnValue(2500)

  await expect(ViewletProcessExplorer.handlePreferencesChanged(state)).resolves.toBe(state)

  expect(invoke).not.toHaveBeenCalled()
})

test('passes the configured refresh interval when opening the process explorer', async () => {
  getPreference.mockReturnValue(2500)
  invoke.mockResolvedValue(undefined as never)
  invoke.mockResolvedValueOnce(undefined as never).mockResolvedValueOnce(undefined as never).mockResolvedValueOnce([] as never)
  const state = ViewletProcessExplorer.create(7, 'process-explorer://', 1, 2, 300, 400)

  await ViewletProcessExplorer.loadContent(state, undefined)

  expect(invoke.mock.calls[0]).toEqual([
    'ProcessExplorer.create',
    7,
    'process-explorer://',
    1,
    2,
    300,
    400,
    { updateInterval: 2500 },
    undefined,
    expect.any(Number),
    expect.any(String),
  ])
})

test.each([
  ['uses the default for an unset preference', undefined, 1000],
  ['uses the default for a malformed preference', '2500', 1000],
  ['uses the default for a not finite preference', NaN, 1000],
  ['clamps values below the minimum', 499, 500],
  ['accepts the minimum', 500, 500],
  ['accepts the maximum', 5000, 5000],
  ['clamps values above the maximum', 5001, 5000],
])('%s', async (_label, value, expected) => {
  getPreference.mockReturnValue(value)

  await ViewletProcessExplorer.handlePreferencesChanged({ processExplorerUpdateInterval: 3000, uid: 7 })

  expect(invoke).toHaveBeenCalledWith('ProcessExplorer.setUpdateInterval', 7, expected)
})
