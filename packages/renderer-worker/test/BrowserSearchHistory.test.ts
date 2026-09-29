import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/LocalStorage/LocalStorage.js', () => ({
  getJson: jest.fn(),
  setJson: jest.fn(),
}))

const BrowserSearchHistory = await import('../src/parts/BrowserSearchHistory/BrowserSearchHistory.js')
const LocalStorage = await import('../src/parts/LocalStorage/LocalStorage.js')

test('loads normalized recent searches', async () => {
  // @ts-ignore
  LocalStorage.getJson.mockResolvedValue([' cheeseburger ', 'CHEESEBURGER', '', 42, 'cheese cake'])

  await expect(BrowserSearchHistory.load()).resolves.toEqual(['cheeseburger', 'cheese cake'])
  expect(LocalStorage.getJson).toHaveBeenCalledWith('simple-browser-search-history')
})

test('returns an empty list when storage cannot be read', async () => {
  // @ts-ignore
  LocalStorage.getJson.mockRejectedValue(new Error('storage unavailable'))

  await expect(BrowserSearchHistory.load()).resolves.toEqual([])
})

test('moves a repeated search to the front', () => {
  expect(BrowserSearchHistory.add(['cheese cake', 'Cheeseburger'], 'cheeseburger')).toEqual(['cheeseburger', 'cheese cake'])
})

test('suggests recent searches by prefix in recency order', () => {
  expect(BrowserSearchHistory.getSuggestions(['cheeseburger recipe', 'cheese cake', 'best cheese'], 'cheese')).toEqual([
    { favicon: '', type: 'history', value: 'cheeseburger recipe' },
    { favicon: '', type: 'history', value: 'cheese cake' },
  ])
})

test('saves searches without surfacing storage failures', async () => {
  const searches = ['cheeseburger']
  // @ts-ignore
  LocalStorage.setJson.mockRejectedValue(new Error('storage full'))

  await expect(BrowserSearchHistory.save(searches)).resolves.toBeUndefined()
  expect(LocalStorage.setJson).toHaveBeenCalledWith('simple-browser-search-history', searches)
})
