/* eslint-disable jest/no-restricted-jest-methods */
import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute: jest.fn() }))

const Command = await import('../src/parts/Command/Command.js')
const ViewletSimpleBrowserImportFirefoxCookies = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserImportFirefoxCookies.js')

test('opens the dedicated cookie import view', async () => {
  const state = { browserViewId: 12, isLoading: false }

  await expect(ViewletSimpleBrowserImportFirefoxCookies.importFirefoxCookies(state)).resolves.toBe(state)
  expect(Command.execute).toHaveBeenCalledWith('Main.openUri', 'cookie-import-view:///')
})
