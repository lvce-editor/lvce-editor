import { expect, test } from '@jest/globals'
import * as GetHeaders from '../src/parts/GetHeaders/GetHeaders.ts'

test('terminal worker allows authenticated loopback websocket connections', () => {
  const headers = GetHeaders.getHeaders({
    absolutePath: '/test/terminalWorkerMain.js',
    etag: 'test-etag',
    isImmutable: false,
    isForElectronProduction: false,
    applicationName: 'lvce',
  })

  expect(headers['Content-Security-Policy']).toContain(`connect-src 'self' ws://127.0.0.1:* ws://localhost:*`)
})

test('text search worker allows authenticated loopback websocket connections', () => {
  const headers = GetHeaders.getHeaders({
    absolutePath: '/test/textSearchWorkerMain.js',
    etag: 'test-etag',
    isImmutable: false,
    isForElectronProduction: false,
    applicationName: 'lvce',
  })

  expect(headers['Content-Security-Policy']).toContain(`connect-src 'self' ws://127.0.0.1:* ws://localhost:*`)
})

test('process explorer worker allows authenticated loopback websocket connections', () => {
  const headers = GetHeaders.getHeaders({
    absolutePath: '/test/process-explorer-worker/index.js',
    etag: 'test-etag',
    isImmutable: false,
    isForElectronProduction: false,
    applicationName: 'lvce',
  })

  expect(headers['Content-Security-Policy']).toContain(`connect-src 'self' ws://127.0.0.1:* ws://localhost:*`)
})
