import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/LocalStorage/LocalStorage.js', () => ({
  getJson: jest.fn(),
  setJson: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/IndexedDbKeyValueStorage/IndexedDbKeyValueStorage.js', () => ({
  get: jest.fn(),
  set: jest.fn(),
}))

const BrowserHistory = await import('../src/parts/BrowserHistory/BrowserHistory.js')
const LocalStorage = await import('../src/parts/LocalStorage/LocalStorage.js')
const IndexedDbKeyValueStorage = await import('../src/parts/IndexedDbKeyValueStorage/IndexedDbKeyValueStorage.js')

test('loads valid entries sorted from newest to oldest', async () => {
  // @ts-ignore
  IndexedDbKeyValueStorage.get.mockResolvedValue([
    { date: 100, url: 'https://older.example/path' },
    { date: 300, url: 'https://newer.example/path' },
    { date: 200, url: 'file:///tmp/private.txt' },
    { date: 'invalid', url: 'https://invalid.example' },
  ])

  await expect(BrowserHistory.load()).resolves.toEqual([
    { date: 300, url: 'https://newer.example/path' },
    { date: 100, url: 'https://older.example/path' },
  ])
  expect(IndexedDbKeyValueStorage.get).toHaveBeenCalledWith('simple-browser-history-v2')
})

test('returns an empty list when storage cannot be read', async () => {
  // @ts-ignore
  LocalStorage.getJson.mockRejectedValue(new Error('storage unavailable'))

  await expect(BrowserHistory.load()).resolves.toEqual([])
})

test('adds an http visit in date order', () => {
  const entries = [{ date: 100, url: 'https://older.example' }]

  expect(BrowserHistory.add(entries, 'http://newer.example/path', 200)).toEqual([
    { date: 200, url: 'http://newer.example/path' },
    { date: 100, url: 'https://older.example' },
  ])
})

test('ignores unsupported urls', () => {
  const entries = [{ date: 100, url: 'https://example.com' }]

  expect(BrowserHistory.add(entries, 'file:///tmp/private.txt', 200)).toBe(entries)
})

test('removes one entry by index', () => {
  const entries = [
    { date: 200, url: 'https://newer.example' },
    { date: 100, url: 'https://older.example' },
  ]

  expect(BrowserHistory.remove(entries, '0')).toEqual([{ date: 100, url: 'https://older.example' }])
})

test('ignores an invalid removal index', () => {
  const entries = [{ date: 100, url: 'https://example.com' }]

  expect(BrowserHistory.remove(entries, 'missing')).toBe(entries)
})

test('records an entry against the latest stored history', async () => {
  // @ts-ignore
  IndexedDbKeyValueStorage.get.mockResolvedValue([{ date: 100, url: 'https://older.example' }])

  await expect(BrowserHistory.record('https://newer.example', 200)).resolves.toEqual([
    { date: 200, url: 'https://newer.example' },
    { date: 100, url: 'https://older.example' },
  ])
  expect(IndexedDbKeyValueStorage.set).toHaveBeenCalledWith('simple-browser-history-v2', [
    { date: 200, url: 'https://newer.example' },
    { date: 100, url: 'https://older.example' },
  ])
})

test('removes the selected entry from the latest stored history', async () => {
  // @ts-ignore
  IndexedDbKeyValueStorage.get.mockResolvedValue([
    { date: 300, url: 'https://newest.example' },
    { date: 200, url: 'https://selected.example' },
    { date: 100, url: 'https://oldest.example' },
  ])

  await expect(BrowserHistory.removeEntry({ date: 200, url: 'https://selected.example' })).resolves.toEqual([
    { date: 300, url: 'https://newest.example' },
    { date: 100, url: 'https://oldest.example' },
  ])
})

test('storage write failures do not break history recording', async () => {
  // @ts-ignore
  LocalStorage.getJson.mockResolvedValue([])
  // @ts-ignore
  IndexedDbKeyValueStorage.set.mockRejectedValue(new Error('storage full'))

  await expect(BrowserHistory.record('https://example.com', 100)).resolves.toEqual([{ date: 100, url: 'https://example.com' }])
})

test('migrates existing local-storage history into IndexedDB', async () => {
  // @ts-ignore
  IndexedDbKeyValueStorage.get.mockResolvedValue(undefined)
  // @ts-ignore
  LocalStorage.getJson.mockResolvedValue([{ date: 100, url: 'https://existing.example' }])

  await expect(BrowserHistory.load()).resolves.toEqual([{ date: 100, url: 'https://existing.example' }])
  expect(IndexedDbKeyValueStorage.set).toHaveBeenCalledWith('simple-browser-history-v2', [{ date: 100, url: 'https://existing.example' }])
})

test('retains history beyond the previous one thousand entry limit', () => {
  const entries = Array.from({ length: 100_000 }, (_, index) => ({ date: 100_000 - index, url: `https://example.test/${index}` }))

  expect(BrowserHistory.normalize(entries)).toHaveLength(100_000)
})
