import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({ get: jest.fn() }))

const Preferences = await import('../src/parts/Preferences/Preferences.js')
const WorkerViewletAdapters = await import('../src/parts/WorkerViewletAdapters/WorkerViewletAdapters.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('hides title bar content before its first render in titlebarless mode', async () => {
  const invoke = jest.fn(async (..._args: readonly unknown[]) => {})
  jest.mocked(Preferences.get).mockReturnValue(true)

  await WorkerViewletAdapters.titleBar.afterLoadContent({ state: { uid: 7 }, worker: { invoke } })

  expect(invoke).toHaveBeenCalledWith('TitleBar.setShowSideBarThings', 7, false)
})

test('leaves initial title bar content visible when not titlebarless', async () => {
  const invoke = jest.fn(async (..._args: readonly unknown[]) => {})
  jest.mocked(Preferences.get).mockReturnValue(false)

  await WorkerViewletAdapters.titleBar.afterLoadContent({ state: { uid: 7 }, worker: { invoke } })

  expect(invoke).not.toHaveBeenCalled()
})
