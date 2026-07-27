import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.ts', () => ({
  invoke: jest.fn(),
}))

const ChromeCookieImport = await import('../src/parts/ChromeCookieImport/ChromeCookieImport.ts')
const MainProcess = await import('../src/parts/MainProcess/MainProcess.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('getInfo', async () => {
  const info = {
    cookieCount: 12,
    profileDirectory: 'Default',
    profileName: 'Personal',
  }
  // @ts-ignore
  MainProcess.invoke.mockResolvedValue(info)

  await expect(ChromeCookieImport.getInfo()).resolves.toEqual(info)
  expect(MainProcess.invoke).toHaveBeenCalledWith('ChromeCookieImport.getInfo')
})

test('importCookies', async () => {
  const result = {
    failed: 0,
    imported: 10,
    skipped: 2,
  }
  // @ts-ignore
  MainProcess.invoke.mockResolvedValue(result)

  await expect(ChromeCookieImport.importCookies()).resolves.toEqual(result)
  expect(MainProcess.invoke).toHaveBeenCalledWith('ChromeCookieImport.importCookies')
})
