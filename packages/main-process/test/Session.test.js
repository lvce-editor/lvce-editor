beforeEach(() => {
  jest.resetModules()
})

afterEach(() => {
  require('../src/parts/ElectronSession/ElectronSession.js').state.session =
    undefined
})

test('get', () => {
  const fakeSession = {
    x: 42,
    webRequest: {
      onHeadersReceived() {},
    },
    protocol: {
      registerFileProtocol() {},
    },
    setPermissionRequestHandler() {},
    setPermissionCheckHandler() {},
  }
  jest.mock('electron', () => {
    return {
      session: {
        fromPartition() {
          return fakeSession
        },
      },
    }
  })
  const Session = require('../src/parts/ElectronSession/ElectronSession.js')
  expect(Session.state.session).toBeUndefined()
  expect(Session.get()).toBe(fakeSession)
  expect(Session.state.session).toBeDefined()
  expect(Session.get()).toBe(fakeSession)
})

test('get - error', () => {
  jest.mock('electron', () => {
    return {
      session: {
        fromPartition() {
          throw new TypeError(`x is not a function`)
        },
      },
    }
  })
  const Session = require('../src/parts/ElectronSession/ElectronSession.js')
  expect(() => Session.get()).toThrowError(new TypeError('x is not a function'))
})

test('handlePermissionCheck - allow writing to clipboard', () => {
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
    },
    setPermissionRequestHandler() {},
    setPermissionCheckHandler(fn) {
      _permissionCheckHandler = fn
    },
  }
  jest.mock('electron', () => {
    return {
      session: {
        fromPartition() {
          return fakeSession
        },
      },
    }
  })
  const Session = require('../src/parts/ElectronSession/ElectronSession.js')
  Session.get()
  expect(_permissionCheckHandler({}, 'clipboard-sanitized-write')).toBe(true)
})

test('handlePermissionRequests - allow reading from', () => {
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
    },
    setPermissionRequestHandler(fn) {
      _permissionRequestHandler = fn
    },
    setPermissionCheckHandler() {},
  }
  jest.mock('electron', () => {
    return {
      session: {
        fromPartition() {
          return fakeSession
        },
      },
    }
  })
  const Session = require('../src/parts/ElectronSession/ElectronSession.js')
  Session.get()
  const callback = jest.fn()
  _permissionRequestHandler({}, 'clipboard-sanitized-write', callback)
  expect(callback).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenCalledWith(true)
})
