import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

beforeEach(() => {
  jest.resetModules()
})

afterEach(async () => {
  ;(await import('../src/parts/ElectronSession/ElectronSession.js')).state.session = undefined
})

test.skip('get', async () => {
  const fakeSession = {
    x: 42,
    webRequest: {
      onHeadersReceived() {},
    },
    protocol: {
      registerFileProtocol() {},
      handle() {},
    },
    setPermissionRequestHandler() {},
    setPermissionCheckHandler() {},
    handle() {},
  }
  jest.unstable_mockModule('electron', () => {
    return {
      session: {
        fromPartition() {
          return fakeSession
        },
      },
    }
  })
  const Session = await import('../src/parts/ElectronSession/ElectronSession.js')
  expect(Session.state.session).toBeUndefined()
  expect(Session.get()).toBe(fakeSession)
  expect(Session.state.session).toBeDefined()
  expect(Session.get()).toBe(fakeSession)
})

test.skip('get - error', async () => {
  jest.unstable_mockModule('electron', () => {
    return {
      session: {
        fromPartition() {
          throw new TypeError('x is not a function')
        },
      },
    }
  })
  const Session = await import('../src/parts/ElectronSession/ElectronSession.js')
  expect(() => Session.get()).toThrow(new TypeError('x is not a function'))
})

test.skip('handlePermissionCheck - allow writing to clipboard', async () => {
  /**
   * @type {any }
   */
  let _permissionCheckHandler
  const fakeSession = {
    x: 42,
    webRequest: {
      onHeadersReceived() {},
    },
    protocol: {
      registerFileProtocol() {},
      handle() {},
    },
    setPermissionRequestHandler() {},
    setPermissionCheckHandler(fn) {
      _permissionCheckHandler = fn
    },
  }
  jest.unstable_mockModule('electron', () => {
    return {
      session: {
        fromPartition() {
          return fakeSession
        },
      },
    }
  })
  const Session = await import('../src/parts/ElectronSession/ElectronSession.js')
  Session.get()
  expect(_permissionCheckHandler({}, 'clipboard-sanitized-write')).toBe(true)
})

test.skip('handlePermissionRequests - allow reading from', async () => {
  /**
   * @type {any }
   */
  let _permissionRequestHandler
  const fakeSession = {
    x: 42,
    webRequest: {
      onHeadersReceived() {},
    },
    protocol: {
      registerFileProtocol() {},
      handle() {},
    },
    setPermissionRequestHandler(fn) {
      _permissionRequestHandler = fn
    },
    setPermissionCheckHandler() {},
  }
  jest.unstable_mockModule('electron', () => {
    return {
      session: {
        fromPartition() {
          return fakeSession
        },
      },
    }
  })
  const Session = await import('../src/parts/ElectronSession/ElectronSession.js')
  Session.get()
  const callback = jest.fn()
  _permissionRequestHandler({}, 'clipboard-sanitized-write', callback)
  expect(callback).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenCalledWith(true)
})
