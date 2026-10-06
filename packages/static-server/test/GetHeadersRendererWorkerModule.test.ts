import { expect, test } from '@jest/globals'
import { getHeaders } from '../src/parts/GetHeaders/GetHeaders.ts'

test.each([
  '/repo/static/57f25eb/packages/renderer-worker/dist/RuntimeConfig.js',
  '/repo/static/57f25eb/packages/renderer-worker/dist/Command.js',
  '/repo/packages/renderer-worker/src/parts/RuntimeConfig/RuntimeConfig.ts',
  String.raw`D:\repo\static\57f25eb\packages\renderer-worker\dist\RuntimeConfig.js`,
])('Renderer worker module receives isolation headers for %s', (absolutePath) => {
  const headers = getHeaders({ absolutePath, etag: 'test', isForElectronProduction: false, isImmutable: true })
  expect(headers['Cross-Origin-Embedder-Policy']).toBe('require-corp')
  expect(headers['Content-Type']).toBe('text/javascript')
  expect(headers['Cache-Control']).toBe('public, max-age=31536000, immutable')
})

test.each(['/repo/packages/renderer-worker/dist/style.css', '/repo/packages/renderer-process/dist/RuntimeConfig.js'])(
  'Unrelated resource keeps its default headers for %s',
  (absolutePath) => {
    const headers = getHeaders({ absolutePath, etag: 'test', isForElectronProduction: false, isImmutable: false })
    expect(headers['Cross-Origin-Embedder-Policy']).toBeUndefined()
  },
)
