import { beforeEach, expect, jest, test } from '@jest/globals'

const getJson = jest.fn<(...args: any[]) => any>()
const invoke = jest.fn<(...args: any[]) => Promise<any>>()
const isCreated = jest.fn(() => false)

jest.unstable_mockModule('../src/parts/ExtensionStateStorage/ExtensionStateStorage.js', () => ({
  getJson,
}))

jest.unstable_mockModule('../src/parts/IframeWorker/IframeWorker.js', () => ({
  invoke,
  isCreated,
}))

const ExtensionHostState = await import('../src/parts/ExtensionHost/ExtensionHostState.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('preserves saved state without launching the iframe worker', async () => {
  const savedState = [{ id: 1, state: { value: 'saved' } }]
  getJson.mockReturnValue(savedState)

  await expect(ExtensionHostState.saveState()).resolves.toBe(savedState)
  expect(invoke).not.toHaveBeenCalled()
})

test('uses an empty state when the iframe worker has never run', async () => {
  getJson.mockReturnValue(undefined)

  await expect(ExtensionHostState.saveState()).resolves.toEqual([])
  expect(invoke).not.toHaveBeenCalled()
})

test('gets current state from a running iframe worker', async () => {
  const currentState = [{ id: 1, state: { value: 'current' } }]
  isCreated.mockReturnValue(true)
  invoke.mockResolvedValue(currentState)

  await expect(ExtensionHostState.saveState()).resolves.toBe(currentState)
  expect(invoke).toHaveBeenCalledWith('WebView.saveState')
})
