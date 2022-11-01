const App = require('../src/parts/App/App.js')
const JsonRpcErrorCode = require('../src/parts/JsonRpcErrorCode/JsonRpcErrorCode.js')

jest.mock('electron', () => {
  return {
    app: {
      name: '',
    },
  }
})
jest.mock('electron-unhandled', () => {
  return {}
})

jest.mock('../src/parts/Command/Command.js', () => {
  return {
    execute() {
      throw new Error(`method not found App.exit`)
    },
  }
})

test.skip('handlePortForMainProcess - error - command not found', async () => {
  let _listener = async (message) => {}
  const port = {
    _listeners: Object.create(null),
    on(event, listener) {
      _listener = listener
    },
    start() {},
    postMessage: jest.fn(),
  }
  const event = {
    ports: [port],
  }

  App.handlePortForMainProcess(event)
  await _listener({
    data: { method: 'App.exit', params: [], jsonrpc: '2.0', id: 1 },
  })
  expect(port.postMessage).toHaveBeenCalledTimes(1)
  expect(port.postMessage).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    id: 1,
    error: {
      message: 'method not found App.exit',
      code: JsonRpcErrorCode.MethodNotFound,
      data: expect.stringMatching('Error: method not found App.exit'),
    },
  })
})
