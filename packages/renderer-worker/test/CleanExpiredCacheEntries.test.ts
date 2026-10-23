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

test('shouldClean returns false when the cache was cleaned less than one week ago', () => {
  expect(CleanExpiredCacheEntries.shouldClean('100000', 100_000 + 7 * 24 * 60 * 60 * 1000 - 1)).toBe(false)
})

test('shouldClean returns true when the cache was cleaned one week ago', () => {
  expect(CleanExpiredCacheEntries.shouldClean('100000', 100_000 + 7 * 24 * 60 * 60 * 1000)).toBe(true)
})

test('shouldRunCleanup returns false for test runs', () => {
  expect(CleanExpiredCacheEntries.shouldRunCleanup('lvce-oss://-/', true)).toBe(false)
})

test('shouldRunCleanup returns false when the cache cleanup flag is set', () => {
  expect(CleanExpiredCacheEntries.shouldRunCleanup('lvce-oss://-/?noCacheCleanup=1', false)).toBe(false)
})

test('shouldRunCleanup returns false when cache cleanup is disabled in preferences', () => {
  expect(CleanExpiredCacheEntries.shouldRunCleanup('lvce-oss://-/', false, false)).toBe(false)
})

test('shouldRunCleanup defaults cache cleanup to enabled', () => {
  expect(CleanExpiredCacheEntries.shouldRunCleanup('lvce-oss://-/', false)).toBe(true)
})

test('shouldRunCleanup returns true for regular startup', () => {
  expect(CleanExpiredCacheEntries.shouldRunCleanup('lvce-oss://-/', false)).toBe(true)
})

test('shouldClean returns true when the stored timestamp is invalid', () => {
  expect(CleanExpiredCacheEntries.shouldClean('invalid', 100_000)).toBe(true)
})

test('shouldClean returns true when the stored timestamp is in the future', () => {
  expect(CleanExpiredCacheEntries.shouldClean('200000', 100_000)).toBe(true)
})

test('cleans expired entries and stores the successful cleanup time', async () => {
  await CleanExpiredCacheEntries.cleanExpiredCacheEntries(100_000)

  expect(deleteExpiredEntries).toHaveBeenCalledWith(100_000)
  expect(setText).toHaveBeenCalledWith(1, 'cacheStorage.lastCleanup', '100000')
})

test('skips cleanup when it ran less than one week ago', async () => {
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
