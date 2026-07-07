import { expect, test } from '@jest/globals'
import * as GetElectronFileResponse from '../src/parts/GetElectronFileResponse/GetElectronFileResponse.js'

test('getElectronFileResponse - malformed remote path', async () => {
  const response = await GetElectronFileResponse.getElectronFileResponse('/remote/D:asample.js', undefined)

  expect(response.init.status).toBe(400)
})
