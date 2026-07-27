import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ConfirmPrompt/ConfirmPrompt.js', () => ({
  prompt: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js', () => ({
  reload: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Notification/Notification.js', () => ({
  create: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invoke: jest.fn(),
}))

const ConfirmPrompt = await import('../src/parts/ConfirmPrompt/ConfirmPrompt.js')
const ElectronBrowserViewFunctions = await import('../src/parts/ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js')
const Notification = await import('../src/parts/Notification/Notification.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const ViewletSimpleBrowserImportChromeCookies = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserImportChromeCookies.js')

const state = {
  browserViewId: 12,
  isLoading: false,
}

beforeEach(() => {
  jest.resetAllMocks()
})

test('asks for confirmation and imports Chrome cookies', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockResolvedValueOnce({
    cookieCount: 12,
    profileDirectory: 'Default',
    profileName: 'Personal',
  })
  // @ts-ignore
  SharedProcess.invoke.mockResolvedValueOnce({
    failed: 0,
    imported: 10,
    skipped: 2,
  })
  // @ts-ignore
  ConfirmPrompt.prompt.mockResolvedValue(true)

  await expect(ViewletSimpleBrowserImportChromeCookies.importChromeCookies(state)).resolves.toEqual({
    ...state,
    isLoading: true,
  })
  expect(ConfirmPrompt.prompt).toHaveBeenCalledWith(
    'Import 12 cookies from Chrome profile "Personal" (Default)? This gives Simple Browser the same website access as Chrome.',
    {
      confirmMessage: 'Import',
      title: 'Import Chrome Cookies',
    },
  )
  expect(SharedProcess.invoke).toHaveBeenNthCalledWith(1, 'ChromeCookieImport.getInfo')
  expect(SharedProcess.invoke).toHaveBeenNthCalledWith(2, 'ChromeCookieImport.importCookies')
  expect(ElectronBrowserViewFunctions.reload).toHaveBeenCalledWith(12)
  expect(Notification.create).toHaveBeenCalledWith('info', 'Imported 10 Chrome cookies (2 skipped, 0 failed).')
})

test('does not import when confirmation is canceled', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockResolvedValue({
    cookieCount: 1,
    profileDirectory: 'Default',
    profileName: 'Personal',
  })
  // @ts-ignore
  ConfirmPrompt.prompt.mockResolvedValue(false)

  await expect(ViewletSimpleBrowserImportChromeCookies.importChromeCookies(state)).resolves.toBe(state)
  expect(ConfirmPrompt.prompt).toHaveBeenCalledWith(
    'Import 1 cookie from Chrome profile "Personal" (Default)? This gives Simple Browser the same website access as Chrome.',
    {
      confirmMessage: 'Import',
      title: 'Import Chrome Cookies',
    },
  )
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronBrowserViewFunctions.reload).not.toHaveBeenCalled()
  expect(Notification.create).not.toHaveBeenCalled()
})

test('shows an actionable import error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockRejectedValue(new Error('Chrome cookie database is busy. Close Chrome and try again.'))

  await expect(ViewletSimpleBrowserImportChromeCookies.importChromeCookies(state)).resolves.toBe(state)
  expect(Notification.create).toHaveBeenCalledWith(
    'error',
    'Failed to import Chrome cookies: Chrome cookie database is busy. Close Chrome and try again.',
  )
  expect(ElectronBrowserViewFunctions.reload).not.toHaveBeenCalled()
})
