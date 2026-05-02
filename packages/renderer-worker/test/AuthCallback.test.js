import { afterEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Location/Location.js', () => {
  return {
    setPathName: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Reload/Reload.js', () => {
  return {
    reload: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const createEventTarget = () => {
  const listeners = new Map()
  return {
    addEventListener(type, listener) {
      const existing = listeners.get(type) || []
      existing.push(listener)
      listeners.set(type, existing)
    },
    dispatch(type) {
      const existing = listeners.get(type) || []
      for (const listener of existing) {
        listener()
      }
    },
  }
}

const createIndexedDb = () => {
  let storedCallbackUrl = undefined
  return {
    open() {
      const request = createEventTarget()
      const database = {
        objectStoreNames: {
          contains() {
            return false
          },
        },
        createObjectStore() {},
        transaction() {
          const transaction = createEventTarget()
          return {
            addEventListener: transaction.addEventListener,
            objectStore() {
              return {
                put(value) {
                  storedCallbackUrl = value
                  queueMicrotask(() => {
                    transaction.dispatch('complete')
                  })
                },
                get() {
                  const getRequest = createEventTarget()
                  queueMicrotask(() => {
                    getRequest.result = storedCallbackUrl
                    getRequest.dispatch('success')
                  })
                  return getRequest
                },
              }
            },
          }
        },
        close() {},
      }
      request.result = database
      queueMicrotask(() => {
        request.dispatch('upgradeneeded')
        request.dispatch('success')
      })
      return request
    },
  }
}

const originalIndexedDb = globalThis.indexedDB

const AuthCallback = await import('../src/parts/AuthCallback/AuthCallback.js')
const Location = await import('../src/parts/Location/Location.js')
const Reload = await import('../src/parts/Reload/Reload.js')

afterEach(() => {
  jest.resetAllMocks()
  globalThis.indexedDB = originalIndexedDb
})

test('getAuthCallbackRedirectPath returns app root for callback route', () => {
  expect(AuthCallback.getAuthCallbackRedirectPath('https://app.example/auth/callback?code=code-1&state=state-1')).toBe('/')
})

test('getAuthCallbackRedirectPath preserves path prefix', () => {
  expect(AuthCallback.getAuthCallbackRedirectPath('https://app.example/lvce-editor/auth/callback.html?code=code-1&state=state-1')).toBe(
    '/lvce-editor/',
  )
})

test('handleAuthCallback persists callback url and redirects to app root', async () => {
  globalThis.indexedDB = createIndexedDb()
  // @ts-ignore
  Location.setPathName.mockResolvedValue(undefined)
  // @ts-ignore
  Reload.reload.mockResolvedValue(undefined)

  const result = await AuthCallback.handleAuthCallback('https://app.example/lvce-editor/auth/callback.html?code=code-1&state=state-1')

  expect(result).toBe(true)
  expect(Location.setPathName).toHaveBeenCalledTimes(1)
  expect(Location.setPathName).toHaveBeenCalledWith('/lvce-editor/')
  expect(Reload.reload).toHaveBeenCalledTimes(1)
  expect(await AuthCallback.hasStoredCallbackUrl()).toBe(true)
})

test('handleAuthCallback ignores non callback urls', async () => {
  globalThis.indexedDB = createIndexedDb()

  const result = await AuthCallback.handleAuthCallback('https://app.example/workspace?folder=/tmp/project')

  expect(result).toBe(false)
  expect(Location.setPathName).not.toHaveBeenCalled()
  expect(Reload.reload).not.toHaveBeenCalled()
  expect(await AuthCallback.hasStoredCallbackUrl()).toBe(false)
})
