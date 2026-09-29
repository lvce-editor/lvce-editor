import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/LocalStorage/LocalStorage.js', () => ({
  getJson: jest.fn(),
  setJson: jest.fn(),
}))

const BrowserVisitedSites = await import('../src/parts/BrowserVisitedSites/BrowserVisitedSites.js')
const LocalStorage = await import('../src/parts/LocalStorage/LocalStorage.js')

test('loads normalized visited sites', async () => {
  // @ts-ignore
  LocalStorage.getJson.mockResolvedValue([
    { favicon: 'https://soundcloud.com/favicon.ico', origin: 'https://soundcloud.com/discover' },
    { favicon: 'https://duplicate.example/favicon.ico', origin: 'https://soundcloud.com' },
    { favicon: 'javascript:alert(1)', origin: 'https://invalid.example' },
  ])

  await expect(BrowserVisitedSites.load()).resolves.toEqual([{ favicon: 'https://soundcloud.com/favicon.ico', origin: 'https://soundcloud.com' }])
  expect(LocalStorage.getJson).toHaveBeenCalledWith('simple-browser-visited-sites')
})

test('returns an empty list when storage cannot be read', async () => {
  // @ts-ignore
  LocalStorage.getJson.mockRejectedValue(new Error('storage unavailable'))

  await expect(BrowserVisitedSites.load()).resolves.toEqual([])
})

test('adds the latest favicon once per origin', () => {
  const sites = [
    { favicon: 'https://old.example/favicon.ico', origin: 'https://soundcloud.com' },
    { favicon: 'https://example.com/favicon.ico', origin: 'https://example.com' },
  ]

  expect(BrowserVisitedSites.add(sites, 'https://soundcloud.com/discover', 'https://soundcloud.com/new-favicon.ico')).toEqual([
    { favicon: 'https://soundcloud.com/new-favicon.ico', origin: 'https://soundcloud.com' },
    { favicon: 'https://example.com/favicon.ico', origin: 'https://example.com' },
  ])
})

test('ignores non-http pages and unusable favicons', () => {
  const sites = [{ favicon: 'https://example.com/favicon.ico', origin: 'https://example.com' }]

  expect(BrowserVisitedSites.add(sites, 'file:///tmp/index.html', 'https://example.com/favicon.ico')).toBe(sites)
  expect(BrowserVisitedSites.add(sites, 'https://example.com', 'blob:https://example.com/icon')).toBe(sites)
})

test('finds matching origins and includes their favicon', () => {
  const sites = [
    { favicon: 'https://soundcloud.com/favicon.ico', origin: 'https://soundcloud.com' },
    { favicon: 'https://example.com/favicon.ico', origin: 'https://example.com' },
  ]

  expect(BrowserVisitedSites.getSuggestions(sites, 'sound')).toEqual([
    {
      favicon: 'https://soundcloud.com/favicon.ico',
      type: 'url',
      value: 'https://soundcloud.com',
    },
  ])
})

test('saves visited sites without surfacing storage failures', async () => {
  const sites = [{ favicon: 'https://soundcloud.com/favicon.ico', origin: 'https://soundcloud.com' }]
  // @ts-ignore
  LocalStorage.setJson.mockRejectedValue(new Error('storage full'))

  await expect(BrowserVisitedSites.save(sites)).resolves.toBeUndefined()
  expect(LocalStorage.setJson).toHaveBeenCalledWith('simple-browser-visited-sites', sites)
})
