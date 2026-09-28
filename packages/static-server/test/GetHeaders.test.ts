import { expect, test } from '@jest/globals'
import { getHeaders } from '../src/parts/GetHeaders/GetHeaders.ts'

test.each([
  '/repo/packages/renderer-worker/node_modules/@lvce-editor/process-explorer-worker/index.js',
  String.raw`D:\repo\packages\renderer-worker\node_modules\@lvce-editor\process-explorer-worker\index.js`,
])('Process Explorer worker receives isolation headers for %s', (absolutePath) => {
  const headers = getHeaders({ absolutePath, etag: 'test', isImmutable: false, isForElectronProduction: false })
  expect(headers['Cross-Origin-Embedder-Policy']).toBe('require-corp')
  expect(headers['Content-Security-Policy']).toBeDefined()
  expect(headers['Content-Type']).toBe('text/javascript')
})
