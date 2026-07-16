import { expect, test } from '@jest/globals'
import * as GetHeaders from '../src/parts/GetHeaders/GetHeaders.ts'

test('extension detail view worker allows GitHub API connections', () => {
  const headers = GetHeaders.getHeaders({
    absolutePath: '/test/extensionDetailViewWorkerMain.js',
    etag: 'test-etag',
    isImmutable: false,
    isForElectronProduction: false,
    applicationName: 'lvce',
  })

  expect(headers['Content-Security-Policy']).toContain('connect-src https://api.github.com')
})
