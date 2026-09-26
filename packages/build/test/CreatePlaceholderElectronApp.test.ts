import { beforeEach, expect, jest, test } from '@jest/globals'
import { archFromString, Platform } from 'electron-builder'

const build = jest.fn()
jest.unstable_mockModule('electron-builder', () => ({ archFromString, Platform, build }))
jest.unstable_mockModule('../src/parts/Copy/Copy.ts', () => ({ copy: jest.fn() }))
jest.unstable_mockModule('../src/parts/Template/Template.ts', () => ({ write: jest.fn() }))
jest.unstable_mockModule('../src/parts/WriteFile/WriteFile.ts', () => ({ writeFile: jest.fn() }))

const { createPlaceholderElectronApp } = await import('../src/parts/CreatePlaceholderElectronApp/CreatePlaceholderElectronApp.ts')

beforeEach(() => {
  jest.clearAllMocks()
})

test.each(['x64', 'arm64'])('builds the placeholder executable for requested %s architecture', async (arch) => {
  await createPlaceholderElectronApp({
    arch,
    config: 'electron_builder_windows_exe',
    product: {},
    version: '1.0.0',
    electronVersion: '42.0.0',
  })
  expect(build).toHaveBeenCalledWith(
    expect.objectContaining({
      targets: Platform.WINDOWS.createTarget('nsis', archFromString(arch)),
    }),
  )
})
