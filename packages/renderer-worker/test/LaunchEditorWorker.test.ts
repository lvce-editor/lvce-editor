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
}))

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

  expect(IpcParent.create).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'Editor Worker',
      url: '/remote/local-editor/dist/editorWorkerMain.js',
    }),
  )
})
