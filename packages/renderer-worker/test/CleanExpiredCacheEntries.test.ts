/* eslint-disable jest/no-restricted-jest-methods -- Cache cleanup tests use ESM module mocks for storage dependencies. */
import { beforeEach, expect, jest, test } from '@jest/globals'

const deleteExpiredEntries = jest.fn<(now: number) => Promise<void>>()
const getText = jest.fn<() => Promise<string>>()
const loggerWarn = jest.fn()
const setText = jest.fn<(_storageType: number, _key: string, _value: string) => Promise<void>>()

jest.unstable_mockModule('../src/parts/CacheStorage/CacheStorage.js', () => ({
  deleteExpiredEntries,
}))

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => ({
  warn: loggerWarn,
}))

jest.unstable_mockModule('../src/parts/WebStorage/WebStorage.js', () => ({
  getText,
  setText,
}))

const CleanExpiredCacheEntries = await import('../src/parts/CleanExpiredCacheEntries/CleanExpiredCacheEntries.js')

beforeEach(() => {
  jest.clearAllMocks()
  getText.mockResolvedValue('')
})

test('shouldClean returns true when the cache has never been cleaned', () => {
  expect(CleanExpiredCacheEntries.shouldClean('', 100_000)).toBe(true)
})

test('shouldClean returns false when the cache was cleaned less than one day ago', () => {
  expect(CleanExpiredCacheEntries.shouldClean('100000', 100_000 + 24 * 60 * 60 * 1000 - 1)).toBe(false)
})

test('shouldClean returns true when the cache was cleaned one day ago', () => {
  expect(CleanExpiredCacheEntries.shouldClean('100000', 100_000 + 24 * 60 * 60 * 1000)).toBe(true)
})

test('shouldClean returns true when the stored timestamp is in the future', () => {
  expect(CleanExpiredCacheEntries.shouldClean('200000', 100_000)).toBe(true)
})

test('cleans expired entries and stores the successful cleanup time', async () => {
  await CleanExpiredCacheEntries.cleanExpiredCacheEntries(100_000)

  expect(deleteExpiredEntries).toHaveBeenCalledWith(100_000)
  expect(setText).toHaveBeenCalledWith(1, 'cacheStorage.lastCleanup', '100000')
})

test('skips cleanup when it ran less than one day ago', async () => {
  getText.mockResolvedValue('90000')

  await CleanExpiredCacheEntries.cleanExpiredCacheEntries(100_000)

  expect(deleteExpiredEntries).not.toHaveBeenCalled()
  expect(setText).not.toHaveBeenCalled()
})

test('does not store the cleanup time when cleanup fails', async () => {
  deleteExpiredEntries.mockRejectedValueOnce(new Error('cache unavailable'))

  await CleanExpiredCacheEntries.cleanExpiredCacheEntries(100_000)

  expect(setText).not.toHaveBeenCalled()
  expect(loggerWarn).toHaveBeenCalledTimes(1)
})
