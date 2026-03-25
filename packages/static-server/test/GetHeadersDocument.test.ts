import { expect, test } from '@jest/globals'
import * as GetHeadersDocument from '../src/parts/GetHeadersDocument/GetHeadersDocument.js'

test('uses default application name when missing', () => {
  const headers = GetHeadersDocument.getHeadersDocument({
    mime: 'text/html',
    etag: 'test-etag',
    isForElectronProduction: false,
  })

  expect(headers['Content-Security-Policy']).toContain(`frame-src 'self' lvce-oss-webview: http://localhost:3001 http://localhost:3002`)
  expect(headers['Content-Security-Policy']).not.toContain('undefined-webview:')
})

test('preserves explicit application name', () => {
  const headers = GetHeadersDocument.getHeadersDocument({
    mime: 'text/html',
    etag: 'test-etag',
    isForElectronProduction: false,
    applicationName: 'lvce',
  })

  expect(headers['Content-Security-Policy']).toContain(`frame-src 'self' lvce-webview: http://localhost:3001 http://localhost:3002`)
})
