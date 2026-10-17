import { afterEach, expect, jest, test } from '@jest/globals'
import * as RuntimeWorkerPaths from '../src/parts/RuntimeWorkerPaths/RuntimeWorkerPaths.ts'

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => ({
  create: jest.fn(async () => ({ send() {} })),
}))

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invoke: jest.fn(),
  invokeAndTransfer: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invokeAndTransfer: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/GetPortTuple/GetPortTuple.js', () => ({
  getPortTuple: () => ({ port1: 'worker-port', port2: 'renderer-port' }),
}))
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const LaunchEditorWorker = await import('../src/parts/LaunchEditorWorker/LaunchEditorWorker.ts')

afterEach(() => {
  RuntimeWorkerPaths.initialize()
  jest.clearAllMocks()
})

test('launches the editor worker configured by --link', async () => {
  RuntimeWorkerPaths.initialize({
    'develop.editorWorkerPath': '/remote/local-editor/dist/editorWorkerMain.js',
  })

  await LaunchEditorWorker.launchEditorWorker()

  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledWith(expect.anything(), 'Editor.handleDirectMessagePort', 'worker-port')
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledWith('HandleMessagePort.handleMessagePort', 'renderer-port', 'Editor')
  expect(IpcParent.create).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'Editor Worker',
      url: '/remote/local-editor/dist/editorWorkerMain.js',
    }),
  )
})
