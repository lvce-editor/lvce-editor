import { jest } from '@jest/globals'
import * as RendererProcessIpcParentType from '../src/parts/RendererProcessIpcParentType/RendererProcessIpcParentType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug = await import(
  '../src/parts/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js'
)

test('create', async () => {
  const port = {
    __isMessagePort: true,
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return port
  })
  const ipc = await IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.create({
    url: 'https://example.com/worker.js',
    name: 'test worker',
  })
  expect(ipc).toBe(port)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('IpcParent.create', {
    method: RendererProcessIpcParentType.ModuleWorkerWithMessagePort,
    name: 'test worker',
    raw: true,
    url: 'https://example.com/worker.js',
  })
})
