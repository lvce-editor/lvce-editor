import { expect, jest, test } from '@jest/globals'
import { FileSystemWorker } from '@lvce-editor/rpc-registry'

jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => ({
  getLogsDir: async () => 'file:///logs',
}))

const PreviewSandboxOutput = await import('../src/parts/PreviewSandboxOutput/PreviewSandboxOutput.js')

test('logWarning appends a message to the preview sandbox log', async () => {
  const fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.appendFile': () => '',
  })

  await PreviewSandboxOutput.logWarning('preview error: ReferenceError: dist is not defined')

  expect(fileSystemRpc.invocations).toEqual([['FileSystem.appendFile', 'file:///logs/log-preview-sandbox.txt', 'preview error: ReferenceError: dist is not defined\n']])
})

test('clearOutput empties the preview sandbox log', async () => {
  const fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.writeFile': () => undefined,
  })

  await PreviewSandboxOutput.clearOutput()

  expect(fileSystemRpc.invocations).toEqual([['FileSystem.writeFile', 'file:///logs/log-preview-sandbox.txt', '']])
})
