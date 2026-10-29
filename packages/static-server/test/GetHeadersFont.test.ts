import { expect, test } from '@jest/globals'
import { getHeaders } from '../src/parts/GetHeaders/GetHeaders.ts'
import { getAbsolutePath } from '../src/parts/GetAbsolutePath/GetAbsolutePath.ts'

test.each([
  '/repo/static/fonts/FiraCode-VariableFont.ttf',
  String.raw`D:\repo\static\fonts\FiraCode-VariableFont.ttf`,
  '/repo/static/fonts/fira-code-latin-400-normal.woff',
  '/repo/static/fonts/fira-code-latin-400-normal.woff2',
])('font response supports isolated WebKit workers for %s', (absolutePath) => {
  const headers = getHeaders({ absolutePath, etag: 'test', isForElectronProduction: false, isImmutable: true })
  expect(headers['Content-Type']).toMatch(/^font\//)
  expect(headers['Cross-Origin-Embedder-Policy']).toBe('require-corp')
  expect(headers['Cross-Origin-Resource-Policy']).toBe('same-origin')
  expect(headers['Cache-Control']).toBe('public, max-age=31536000, immutable')
  expect(headers.Etag).toBe('test')
})

test('development font paths resolve to the installed npm package', () => {
  expect(getAbsolutePath('/fonts/400.css')).toMatch(/@fontsource[/\\]fira-code[/\\]400\.css$/)
  expect(getAbsolutePath('/fonts/files/fira-code-latin-400-normal.woff2')).toMatch(/@fontsource[/\\]fira-code[/\\]files[/\\]fira-code-latin-400-normal\.woff2$/)
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
