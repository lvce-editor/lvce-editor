import { jest } from '@jest/globals'
import * as ServiceWorker from '../src/parts/ServiceWorker/ServiceWorker.js'

test('register', async () => {
  globalThis.navigator = {
    // @ts-ignore
    serviceWorker: {
      register: jest.fn(() => {
        return {
          onupdatefound: jest.fn(),
        }
      }),
    },
  }
  await ServiceWorker.register('/service-worker.js')
  expect(globalThis.navigator.serviceWorker.register).toHaveBeenCalledWith(
    '/service-worker.js',
    { scope: '/', type: 'module' }
  )
})

test('register - error', async () => {
  globalThis.navigator = {
    // @ts-ignore
    serviceWorker: {
      register: jest.fn(() => {
        throw new Error('not supported')
      }),
    },
  }
  await expect(
    ServiceWorker.register('/service-worker.js')
  ).rejects.toThrowError(new Error('not supported'))
})

test('uninstall', async () => {
  const mockUnregister = jest.fn()
  globalThis.navigator = {
    // @ts-ignore
    serviceWorker: {
      // @ts-ignore
      getRegistrations() {
        return [
          {
            unregister: mockUnregister,
          },
        ]
      },
    },
  }
  await ServiceWorker.uninstall()
  expect(mockUnregister).toHaveBeenCalled()
})

test('uninstall - error', async () => {
  const mockUnregister = jest.fn()
  globalThis.navigator = {
    // @ts-ignore
    serviceWorker: {
      // @ts-ignore
      getRegistrations() {
        return [
          {
            unregister() {
              throw new Error('not supported')
            },
          },
        ]
      },
    },
  }
  await expect(ServiceWorker.uninstall()).rejects.toThrowError(
    new Error('not supported')
  )
})
