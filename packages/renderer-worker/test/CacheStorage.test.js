/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as CacheStorage from '../src/parts/CacheStorage/CacheStorage.js'

// Cache Api is not supported in jsdom https://github.com/jsdom/jsdom/issues/2422
// so just mock globalThis.caches in the meantime

afterEach(() => {
  delete globalThis.caches
  delete globalThis.Response
  delete globalThis.Headers
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
  await expect(CacheStorage.getJson('sample-key-2')).rejects.toThrowError(
    'Failed to get json from cache "sample-key-2"'
  )
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
    constructor(value) {
      this.value = value
    }
  }
  // @ts-ignore
  globalThis.Headers = class {}
  await CacheStorage.setJson('sample-key-5', {})
  expect(put).toHaveBeenCalledWith('sample-key-5', { value: '{}' })
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
  await expect(CacheStorage.setJson('sample-key-6', {})).rejects.toThrowError(
    'Failed to put json into cache "sample-key-6"'
  )
})

test('setJson - caches are not available', async () => {
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
  expect(await CacheStorage.getTextFromCache('sample-key-3')).toBe(
    'sample text'
  )
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
  await expect(
    CacheStorage.getTextFromCache('sample-key-4')
  ).rejects.toThrowError('Failed to get text from cache "sample-key-4"')
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
  delete globalThis.caches
  expect(await CacheStorage.getTextFromCache('sample-key-4')).toBeUndefined()
})

test('clearCache', async () => {
  // @ts-ignore
  globalThis.caches = {
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
  await expect(CacheStorage.clearCache()).rejects.toThrowError(
    'Failed to clear cache'
  )
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
  delete globalThis.caches
  await CacheStorage.clearCache()
})
