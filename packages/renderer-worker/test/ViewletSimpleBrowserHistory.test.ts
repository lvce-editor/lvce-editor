import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/BrowserHistory/BrowserHistory.js', () => ({
  clear: jest.fn(),
  load: jest.fn(),
  removeEntry: jest.fn(),
}))

const BrowserHistory = await import('../src/parts/BrowserHistory/BrowserHistory.js')
const ViewletSimpleBrowserHistory = await import('../src/parts/ViewletSimpleBrowserHistory/ViewletSimpleBrowserHistory.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('create', () => {
  expect(ViewletSimpleBrowserHistory.create(12, 'simple-browser-history://')).toEqual({
    uid: 12,
    uri: 'simple-browser-history://',
    loaded: false,
    entries: [],
    searchValue: '',
  })
})

test('loadContent loads persistent history', async () => {
  const entries = [{ date: 100, url: 'https://example.com' }]
  // @ts-ignore
  BrowserHistory.load.mockResolvedValue(entries)
  const state = ViewletSimpleBrowserHistory.create(12, 'simple-browser-history://')

  await expect(ViewletSimpleBrowserHistory.loadContent(state)).resolves.toEqual({
    ...state,
    entries,
    loaded: true,
  })
})

test('handleInput', () => {
  const state = ViewletSimpleBrowserHistory.create(12, 'simple-browser-history://')

  expect(ViewletSimpleBrowserHistory.handleInput(state, 'example')).toEqual({
    ...state,
    searchValue: 'example',
  })
})

test('clearHistory clears and persists entries', async () => {
  // @ts-ignore
  BrowserHistory.clear.mockResolvedValue([])
  const state = {
    ...ViewletSimpleBrowserHistory.create(12, 'simple-browser-history://'),
    entries: [{ date: 100, url: 'https://example.com' }],
  }

  await expect(ViewletSimpleBrowserHistory.clearHistory(state)).resolves.toEqual({ ...state, entries: [] })
  expect(BrowserHistory.clear).toHaveBeenCalledTimes(1)
})

test('removeEntry removes and persists one entry', async () => {
  const remainingEntries = [{ date: 100, url: 'https://older.example' }]
  // @ts-ignore
  BrowserHistory.removeEntry.mockResolvedValue(remainingEntries)
  const state = {
    ...ViewletSimpleBrowserHistory.create(12, 'simple-browser-history://'),
    entries: [{ date: 200, url: 'https://newer.example' }, ...remainingEntries],
  }

  await expect(ViewletSimpleBrowserHistory.removeEntry(state, '0')).resolves.toEqual({ ...state, entries: remainingEntries })
  expect(BrowserHistory.removeEntry).toHaveBeenCalledWith(state.entries[0])
})
