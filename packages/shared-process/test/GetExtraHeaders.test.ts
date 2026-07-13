import { expect, test } from '@jest/globals'
import * as GetExtraHeaders from '../src/parts/GetExtraHeaders/GetExtraHeaders.js'

test('loads static server headers from typescript source', async () => {
  const headers = await GetExtraHeaders.getExtraHeaders({
    absolutePath: '/tmp/aboutWorkerMain.js',
    etag: 'test-etag',
    isForElectronProduction: false,
    pathName: '/aboutWorkerMain.js',
  })

  expect(headers['Content-Type']).toBe('text/javascript')
})
