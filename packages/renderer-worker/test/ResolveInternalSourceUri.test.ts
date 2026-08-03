import { expect, jest, test } from '@jest/globals'
import { resolveInternalSourceUri } from '../src/parts/ResolveInternalSourceUri/ResolveInternalSourceUri.ts'

test('resolveInternalSourceUri - resolves an lvce uri on disk', async () => {
  const invoke = jest.fn(async (_method: string, _uri: string) => 'file:///usr/lib/lvce/resources/app/static/abc123/rendererWorkerMain.js')

  await expect(resolveInternalSourceUri('lvce://-/abc123/rendererWorkerMain.js', invoke)).resolves.toBe(
    'file:///usr/lib/lvce/resources/app/static/abc123/rendererWorkerMain.js',
  )
  expect(invoke).toHaveBeenCalledWith('GetElectronFileResponse.resolveElectronFileUri', 'lvce://-/abc123/rendererWorkerMain.js')
})

test('resolveInternalSourceUri - resolves an lvce oss uri on disk', async () => {
  const invoke = jest.fn(async (_method: string, _uri: string) => 'file:///home/test/lvce-editor/packages/rendererWorkerMain.js')

  await expect(resolveInternalSourceUri('lvce-oss://-/packages/rendererWorkerMain.js', invoke)).resolves.toBe(
    'file:///home/test/lvce-editor/packages/rendererWorkerMain.js',
  )
})

test('resolveInternalSourceUri - keeps a file uri unchanged', async () => {
  const invoke = jest.fn(async (_method: string, _uri: string) => '')

  await expect(resolveInternalSourceUri('file:///tmp/test.js', invoke)).resolves.toBe('file:///tmp/test.js')
  expect(invoke).not.toHaveBeenCalled()
})
