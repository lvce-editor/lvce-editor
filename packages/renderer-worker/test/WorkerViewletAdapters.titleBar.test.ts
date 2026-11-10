import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({ get: jest.fn() }))

const Preferences = await import('../src/parts/Preferences/Preferences.js')
const WorkerViewletAdapters = await import('../src/parts/WorkerViewletAdapters/WorkerViewletAdapters.js')

beforeEach(() => {
  jest.clearAllMocks()
  ViewletStates.reset()
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

test('reserves a distinct menu widget UID for each title bar and retains it on reload', () => {
  const first = WorkerViewletAdapters.titleBar.prepareLoadState({ uid: 7 })
  const second = WorkerViewletAdapters.titleBar.prepareLoadState({ uid: 8 })
  expect(first.menuUid).not.toBe(second.menuUid)
  expect(WorkerViewletAdapters.titleBar.prepareLoadState(first).menuUid).toBe(first.menuUid)
})

test('reloading starts menu declarations beyond the revision already applied by layout', () => {
  const layoutState = { uid: 1, widgetRevisions: { 7: 42 } }
  ViewletStates.set(1, { factory: {}, moduleId: 'Layout', renderedState: layoutState, state: layoutState })
  const next = WorkerViewletAdapters.titleBar.prepareLoadState({ menuUid: 100, uid: 7 })
  expect(next.menuUid).toBe(100)
  expect(next.menuRevision).toBe(43)
})
