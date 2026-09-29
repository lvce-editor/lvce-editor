/**
 * @jest-environment jsdom
 */
import { afterEach, expect, jest, test } from '@jest/globals'
import * as CacheStorage from '../src/parts/CacheStorage/CacheStorage.js'

// Cache Api is not supported in jsdom https://github.com/jsdom/jsdom/issues/2422
// so just mock globalThis.caches in the meantime

afterEach(() => {
  // @ts-ignore
  delete globalThis.caches
  // @ts-ignore
  delete globalThis.Response
  // @ts-ignore
  delete globalThis.Headers
  // @ts-ignore
  delete globalThis.navigator.storageBuckets
})

test('getJson', async () => {
  globalThis.caches = {
    // @ts-ignore
    open() {
      return {
        match() {
          return {
            json() {
              return { x: 2 }
            },
          }
        },
      }
    },
  }
  expect(await CacheStorage.getJson('sample-key-1')).toEqual({ x: 2 })
})

test('getJson - error', async () => {
  globalThis.caches = {
    // @ts-ignore
    open() {
      return {
        match() {
          return {
            json() {
              throw new SyntaxError('Unexpected token , in position 253')
            },
          }
        },
      }
    },
  }
  await expect(CacheStorage.getJson('sample-key-2')).rejects.toThrow('Failed to get json from cache "sample-key-2"')
})

test('getJson - error - firefox', async () => {
  // @ts-ignore
  globalThis.caches = {
    open() {
      throw new DOMException('The operation is insecure.')
    },
  }
  expect(await CacheStorage.getJson('sample-key-2')).toBe(undefined)
})

test('getJson - caches are not available', async () => {
  // @ts-ignore
  delete globalThis.caches
  expect(await CacheStorage.getJson('sample-key-1')).toBeUndefined()
})

test('setJson', async () => {
  const put = jest.fn()
  globalThis.caches = {
    // @ts-ignore
    open() {
      return {
        put,
      }
    },
  }
  // @ts-ignore
  globalThis.Response = class {
    value: any
    options: any

    constructor(value, options) {
      this.value = value
      this.options = options
    }
  }
  // @ts-ignore
  globalThis.Headers = class {
    value: any

    constructor(value) {
      this.value = value
    }
  }
  await CacheStorage.setJson('sample-key-5', {})
  const response = put.mock.calls[0][1] as {
    readonly options: { readonly headers: { readonly value: { readonly Expires: string } } }
    readonly value: string
  }
  expect(response.value).toBe('{}')
  expect(Date.parse(response.options.headers.value.Expires)).toBeGreaterThan(Date.now())
})

test('setJson - error', async () => {
  globalThis.caches = {
    // @ts-ignore
    open() {
      return {
        match() {
          return {
            put() {
              throw new Error('put is not working')
            },
          }
        },
      }
    },
  }
  await expect(CacheStorage.setJson('sample-key-6', {})).rejects.toThrow('Failed to put json into cache "sample-key-6"')
})

test('setJson - caches are not available', async () => {
  // @ts-ignore
  delete globalThis.caches
  await CacheStorage.setJson('sample-key-6', {})
})

test('setJson - error - firefox', async () => {
  // @ts-ignore
  globalThis.caches = {
    open() {
      throw new DOMException('The operation is insecure.')
    },
  }
  await CacheStorage.setJson('sample-key-6', {})
})

test('getText', async () => {
  globalThis.caches = {
    // @ts-ignore
    open() {
      return {
        match() {
          return {
            text() {
              return 'sample text'
            },
          }
        },
      }
    },
  }
  expect(await CacheStorage.getTextFromCache('sample-key-3')).toBe('sample text')
})

test('getText - error', async () => {
  globalThis.caches = {
    // @ts-ignore
    open() {
      return {
        match() {
          return {
            text() {
              throw new TypeError('text must be of type string')
            },
          }
        },
      }
    },
  }
  await expect(CacheStorage.getTextFromCache('sample-key-4')).rejects.toThrow('Failed to get text from cache "sample-key-4"')
})

test('getText - error - firefox', async () => {
  // @ts-ignore
  globalThis.caches = {
    open() {
      throw new DOMException('The operation is insecure.')
    },
  }
  expect(await CacheStorage.getTextFromCache('sample-key-4')).toBeUndefined()
})

test('getText - caches are not available', async () => {
  // @ts-ignore
  delete globalThis.caches
  expect(await CacheStorage.getTextFromCache('sample-key-4')).toBeUndefined()
})

test('deleteExpiredEntries deletes entries whose Expires header has elapsed', async () => {
  const expiredRequest = { url: 'https://example.com/expired' }
  const freshRequest = { url: 'https://example.com/fresh' }
  const persistentRequest = { url: 'https://example.com/persistent' }
  const invalidRequest = { url: 'https://example.com/invalid' }
  const deleteEntry = jest.fn()
  const responses = new Map([
    [expiredRequest, { headers: { get: () => 'Sat, 22 Aug 2026 11:59:59 GMT' } }],
    [freshRequest, { headers: { get: () => 'Sat, 22 Aug 2026 12:00:01 GMT' } }],
    [persistentRequest, { headers: { get: () => null } }],
    [invalidRequest, { headers: { get: () => 'invalid' } }],
  ])
  const cache = {
    delete: deleteEntry,
    keys: () => [...responses.keys()],
    match: (request) => responses.get(request),
  }
  globalThis.caches = {
    // @ts-ignore
    keys: () => ['cache-1'],
    // @ts-ignore
    open: () => cache,
  }

  await CacheStorage.deleteExpiredEntries(Date.UTC(2026, 7, 22, 12, 0, 0))

  expect(deleteEntry).toHaveBeenCalledTimes(1)
  expect(deleteEntry).toHaveBeenCalledWith(expiredRequest)
})

test('deleteExpiredEntries checks every cache', async () => {
  const open = jest.fn((_cacheName: string) => ({
    keys: () => [],
  }))
  globalThis.caches = {
    // @ts-ignore
    keys: () => ['cache-1', 'cache-2'],
    // @ts-ignore
    open,
  }

  await CacheStorage.deleteExpiredEntries()

  expect(open).toHaveBeenCalledTimes(2)
  expect(open).toHaveBeenNthCalledWith(1, 'cache-1')
  expect(open).toHaveBeenNthCalledWith(2, 'cache-2')
})

test('deleteExpiredEntries cleans storage bucket caches', async () => {
  const request = { url: 'https://example.com/expired' }
  const deleteEntry = jest.fn()
  const cacheStorage = {
    keys: () => ['cache-1'],
    open: () => ({
      delete: deleteEntry,
      keys: () => [request],
      match: () => ({ headers: { get: () => 'Sat, 22 Aug 2026 11:59:59 GMT' } }),
    }),
  }
  const openBucket = jest.fn((_bucketName: string) => ({ caches: cacheStorage }))
  Object.defineProperty(globalThis.navigator, 'storageBuckets', {
    configurable: true,
    value: {
      keys: () => ['bucket-1'],
      open: openBucket,
    },
  })

  await CacheStorage.deleteExpiredEntries(Date.UTC(2026, 7, 22, 12, 0, 0))

  expect(openBucket).toHaveBeenCalledWith('bucket-1')
  expect(deleteEntry).toHaveBeenCalledWith(request)
})

test('deleteExpiredEntries does nothing when cache storage is not available', async () => {
  // @ts-ignore
  delete globalThis.caches

  await CacheStorage.deleteExpiredEntries()
})

test('clearCache', async () => {
  // @ts-ignore
  globalThis.caches = {
    // @ts-ignore
    delete: jest.fn(),
  }
  await CacheStorage.clearCache()
  expect(globalThis.caches.delete).toHaveBeenCalledTimes(1)
})

test('clearCache - error', async () => {
  // @ts-ignore
  globalThis.caches = {
    delete() {
      throw new Error('not allowed')
    },
  }
  await expect(CacheStorage.clearCache()).rejects.toThrow('Failed to clear cache')
})

test('clearCache - error - firefox', async () => {
  // @ts-ignore
  globalThis.caches = {
    delete() {
      throw new DOMException('The operation is insecure.')
    },
  }
  await CacheStorage.clearCache()
})

test('clearCache - caches are not available', async () => {
  // @ts-ignore
  delete globalThis.caches
  await CacheStorage.clearCache()
})
