import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    state: {
      ipc: {
        set onmessage(listener) {
          this._onmessage = listener
        },
        get onmessage() {
          return this._onmessage
        },
      },
    },
    send: jest.fn(),
  }
})
jest.unstable_mockModule('../src/parts/Callback/Callback.js', () => {
  return {
    register: jest.fn(),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const Callback = await import('../src/parts/Callback/Callback.js')
const IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug = await import(
  '../src/parts/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js'
)

test('create', async () => {
  let _resolve
  // @ts-ignore
  Callback.register.mockImplementation((resolve) => {
    _resolve = resolve
  })
  const port = {
    __isMessagePort: true,
  }
  // @ts-ignore
  RendererProcess.send.mockImplementation(() => {
    _resolve({
      result: port,
    })
  })
  const ipc = await IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.create({
    url: 'https://example.com/worker.js',
    name: 'test worker',
  })
  expect(ipc).toBe(port)
})
