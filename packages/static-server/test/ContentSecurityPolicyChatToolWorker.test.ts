import { expect, test } from '@jest/globals'
import * as GetHeaders from '../src/parts/GetHeaders/GetHeaders.js'

test('chat tool worker allows same-origin connections', () => {
  const headers = GetHeaders.getHeaders({
    absolutePath: '/test/chatToolWorkerMain.js',
    etag: 'test-etag',
    isImmutable: false,
    isForElectronProduction: false,
    applicationName: 'lvce',
  })

  expect(headers['Content-Security-Policy']).toContain(`connect-src 'self'`)
})
