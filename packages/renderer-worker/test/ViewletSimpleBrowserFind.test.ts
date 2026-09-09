import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({ invoke: jest.fn() }))
jest.unstable_mockModule('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js', () => ({ focus: jest.fn() }))
jest.unstable_mockModule('../src/parts/ElectronWindow/ElectronWindow.js', () => ({ focus: jest.fn() }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ executeViewletCommand: jest.fn() }))
jest.unstable_mockModule('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js', () => ({
  closeSuggestions: jest.fn(async (state) => state),
  updateFindKeyBindings: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserResize.js', () => ({ resizeEffect: jest.fn() }))

const Find = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserFind.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const Native = await import('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js')
const Resize = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserResize.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')

const state = {
  uid: 42,
  browserViewId: 12,
  findVisible: true,
  findValue: 'needle',
  findMatchCase: false,
  findMatches: 3,
  findActiveMatch: 1,
  findRequestId: 5,
  findFocusVersion: 0,
  headerHeight: 101,
}

beforeEach(() => {
  jest.clearAllMocks()
  // @ts-ignore
  SharedProcess.invoke.mockResolvedValue({ matches: 3, activeMatchOrdinal: 1 })
})

test('updates the query immediately and applies only the matching native response', async () => {
  const next = Find.handleFindInput(state, 'other')
  expect(next.findValue).toBe('other')
  expect(SharedProcess.invoke).toHaveBeenCalledWith('BrowserFind.find', 12, 'other', true, false, true)
  await Promise.resolve()
  expect(Viewlet.executeViewletCommand).toHaveBeenCalledWith(42, 'applyFindResult', 12, next.findRequestId, { matches: 3, activeMatchOrdinal: 1 })
  const result = { matches: 2, activeMatchOrdinal: 2 }
  expect(Find.applyFindResult(next, 12, next.findRequestId, result)).toMatchObject({ findMatches: 2, findActiveMatch: 2 })
  expect(Find.applyFindResult(next, 12, -1, result)).toBe(next)
  expect(Find.applyFindResult(next, 13, next.findRequestId, result)).toBe(next)
  const closed = { ...next, findVisible: false }
  expect(Find.applyFindResult(closed, 12, next.findRequestId, result)).toBe(closed)
})

test('closing clears highlights, restores page bounds and focuses the page', async () => {
  const next = await Find.closeFind(state)
  expect(next).toMatchObject({ findVisible: false, headerHeight: 65, findMatches: 0, findValue: 'needle' })
  expect(SharedProcess.invoke).toHaveBeenCalledWith('BrowserFind.stop', 12)
  expect(Resize.resizeEffect).toHaveBeenCalledWith(next)
  expect(Native.focus).toHaveBeenCalledWith(12)
  await expect(Find.closeFind(next)).resolves.toBe(next)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
})

test('switching tabs does not restore focus to the old page', async () => {
  await Find.closeFind(state, false)
  expect(Native.focus).not.toHaveBeenCalled()
})

test('next and previous continue the current search', () => {
  Find.findNext(state)
  Find.findPrevious(state)
  expect(SharedProcess.invoke).toHaveBeenNthCalledWith(1, 'BrowserFind.find', 12, 'needle', true, false, false)
  expect(SharedProcess.invoke).toHaveBeenNthCalledWith(2, 'BrowserFind.find', 12, 'needle', false, false, false)
})
