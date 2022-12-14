import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      state: {
        ipc: {
          onmessage: jest.fn(),
        },
      },
      send: jest.fn(),
    }
  }
)

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug = await import(
  '../src/parts/IpcParent/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js'
)

test('create', () => {
  // TODO
})
