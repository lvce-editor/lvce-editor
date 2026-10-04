import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn(async (...args) => {
  expect(args).toEqual(['Extensions.getColorThemeNames', '/app', 'web'])
  return ['slime', 'cobalt2']
})

jest.unstable_mockModule('../src/parts/AssetDir/AssetDir.js', () => ({
  assetDir: '/app',
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: () => 'web',
}))

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({
  invoke,
}))

const GetColorThemeNames = await import('../src/parts/GetColorThemeNames/GetColorThemeNames.js')

test('getColorThemeNames uses the current asset directory and platform by default', async () => {
  const result = await GetColorThemeNames.getColorThemeNames()

  expect(result).toEqual(['slime', 'cobalt2'])
  expect(invoke).toHaveBeenCalledTimes(1)
})
