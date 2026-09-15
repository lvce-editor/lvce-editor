import { expect, test } from '@jest/globals'
import * as GetHeaders from '../src/parts/GetHeaders/GetHeaders.ts'

test('session replay worker is isolated and can upload to the backend', () => {
  const headers = GetHeaders.getHeaders({
    absolutePath: '/packages/renderer-process/dist/sessionReplayWorkerMain.js',
    etag: 'test',
    isImmutable: false,
    isForElectronProduction: false,
  })
  expect(headers['Cross-Origin-Embedder-Policy']).toBe('require-corp')
  expect(headers['Content-Security-Policy']).toContain("connect-src 'self' https:")
})
