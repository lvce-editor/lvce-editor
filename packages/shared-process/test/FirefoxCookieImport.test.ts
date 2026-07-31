import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.ts', () => ({
  invoke: jest.fn(),
}))

const FirefoxCookieImport = await import('../src/parts/FirefoxCookieImport/FirefoxCookieImport.ts')
const MainProcess = await import('../src/parts/MainProcess/MainProcess.ts')

test('getInfo', async () => {
  const info = {
    cookieCount: 12,
    profileDirectory: 'Profiles/abc.default-release',
    profileName: 'default-release',
  }
  // @ts-ignore
  MainProcess.invoke.mockResolvedValue(info)

  await expect(FirefoxCookieImport.getInfo()).resolves.toEqual(info)
  expect(MainProcess.invoke).toHaveBeenCalledWith('FirefoxCookieImport.getInfo')
})

test('importCookies', async () => {
  const result = {
    failed: 0,
    imported: 10,
    skipped: 2,
  }
  // @ts-ignore
  MainProcess.invoke.mockResolvedValue(result)

  await expect(FirefoxCookieImport.importCookies()).resolves.toEqual(result)
  expect(MainProcess.invoke).toHaveBeenCalledWith('FirefoxCookieImport.importCookies')
})
