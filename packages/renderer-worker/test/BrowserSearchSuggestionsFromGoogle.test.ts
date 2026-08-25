import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.clearAllMocks()
})

jest.unstable_mockModule('../src/parts/ElectronNet/ElectronNet.js', () => ({
  getJson: jest.fn(),
}))

const BrowserSearchSuggestionsFromGoogle = await import('../src/parts/BrowserSearchSuggestionsFromGoogle/BrowserSearchSuggestionsFromGoogle.js')
const ElectronNet = await import('../src/parts/ElectronNet/ElectronNet.js')

test('encodes the query and returns at most seven non-empty strings', async () => {
  // @ts-ignore
  ElectronNet.getJson.mockResolvedValue(['what is & why', ['one', '', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 9]])

  await expect(BrowserSearchSuggestionsFromGoogle.get('what is & why')).resolves.toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven'])
  expect(ElectronNet.getJson).toHaveBeenCalledWith('https://suggestqueries.google.com/complete/search?client=chrome&hl=en&q=what%20is%20%26%20why')
})

test('returns an empty list for an unexpected response', async () => {
  // @ts-ignore
  ElectronNet.getJson.mockResolvedValue({ suggestions: ['one'] })

  await expect(BrowserSearchSuggestionsFromGoogle.get('query')).resolves.toEqual([])
})
