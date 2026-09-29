import { expect, test } from '@jest/globals'
import * as GetHeaders from '../src/parts/GetHeaders/GetHeaders.ts'

test('source control worker can import its tree view module', () => {
  const headers = GetHeaders.getHeaders({
    absolutePath: '/test/sourceControlWorkerMain.js',
    etag: 'test-etag',
    isImmutable: false,
    isForElectronProduction: false,
    applicationName: 'lvce',
  })

  expect(headers['Content-Security-Policy']).toBe("default-src 'none'; script-src 'self';")
})
