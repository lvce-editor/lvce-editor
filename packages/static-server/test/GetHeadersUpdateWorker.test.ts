import { expect, test } from '@jest/globals'
import { getHeaders } from '../src/parts/GetHeaders/GetHeaders.ts'

test.each([false, true])('update worker headers permit release metadata and downloads (Electron production: %s)', (isForElectronProduction) => {
  const headers = getHeaders({
    absolutePath: '/packages/update-worker/dist/updateWorkerMain.js',
    applicationName: 'lvce',
    etag: 'test',
    isImmutable: true,
    isForElectronProduction,
  })
  const connect = headers['Content-Security-Policy']
    .split(';')
    .map((directive) => directive.trim())
    .find((directive) => directive.startsWith('connect-src '))
  expect(connect?.split(/\s+/).slice(1)).toEqual(['https://github.com', 'https://api.github.com', 'https://release-assets.githubusercontent.com'])
})
