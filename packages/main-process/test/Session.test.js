beforeEach(() => {
  jest.resetModules()
})

afterEach(() => {
  require('../src/parts/Session/Session.js').state.session = undefined
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
  const Session = require('../src/parts/Session/Session.js')
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
  const Session = require('../src/parts/Session/Session.js')
  expect(() => Session.get()).toThrowError(new TypeError('x is not a function'))
})
