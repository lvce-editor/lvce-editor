import { jest } from '@jest/globals'

jest.unstable_mockModule('electron', () => {
  return {
    app: {
      name: '',
    },
    screen: {},
    net: {},
    BrowserWindow: class {},
    shell: {},
    ipcMain: {},
    MessageChannelMain: class {},
    ApplicationMenu: class {},
    Menu: class {},
  }
})

jest.unstable_mockModule('electron-unhandled', () => {
  return {
    default() {},
  }
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute() {
      throw new Error(`method not found App.exit`)
    },
  }
})

const App = await import('../src/parts/App/App.js')

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

  // @ts-ignore
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
      code: -32001,
      data: expect.stringMatching('Error: method not found App.exit'),
    },
  })
})
