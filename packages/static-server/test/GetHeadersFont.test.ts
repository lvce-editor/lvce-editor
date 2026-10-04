import { expect, test } from '@jest/globals'
import { getHeaders } from '../src/parts/GetHeaders/GetHeaders.ts'

test.each([
  '/repo/static/fonts/FiraCode-VariableFont.ttf',
  String.raw`D:\repo\static\fonts\FiraCode-VariableFont.ttf`,
])('font response supports isolated WebKit workers for %s', (absolutePath) => {
  const headers = getHeaders({ absolutePath, etag: 'test', isForElectronProduction: false, isImmutable: true })
  expect(headers['Content-Type']).toBe('font/ttf')
  expect(headers['Cross-Origin-Embedder-Policy']).toBe('require-corp')
  expect(headers['Cross-Origin-Resource-Policy']).toBe('same-origin')
  expect(headers['Cache-Control']).toBe('public, max-age=31536000, immutable')
  expect(headers.Etag).toBe('test')
})

test('text measurement worker permits WebKit font requests while retaining isolation', () => {
  const headers = getHeaders({
    absolutePath: '/repo/packages/text-measurement-worker/dist/textMeasurementWorkerMain.js',
    etag: 'test',
    isForElectronProduction: false,
    isImmutable: true,
  })
  const directives = headers['Content-Security-Policy'].split(';').map((value) => value.trim())
  expect(directives).toContain("worker-src 'self'")
  expect(directives).toContain("font-src 'self'")
  expect(directives).toContain("default-src 'none'")
  expect(headers['Cross-Origin-Embedder-Policy']).toBe('require-corp')
  expect(headers['Cross-Origin-Resource-Policy']).toBe('same-origin')
})

test('ordinary static assets retain their default headers', () => {
  const headers = getHeaders({ absolutePath: '/repo/static/style.css', etag: 'test', isForElectronProduction: false, isImmutable: false })
  expect(headers['Content-Type']).toBe('text/css')
  expect(headers['Cross-Origin-Embedder-Policy']).toBeUndefined()
  expect(headers['Cross-Origin-Resource-Policy']).toBe('same-origin')
})
