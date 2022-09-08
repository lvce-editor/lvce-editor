import * as Platform from '../src/parts/Platform/Platform.js'

test('isWindows', () => {
  expect(Platform.isWindows).toEqual(expect.any(Boolean))
})

test('isMacOs', () => {
  expect(Platform.isMacOs).toEqual(expect.any(Boolean))
})

test('dataDir', () => {
  expect(Platform.dataDir).toEqual(expect.any(String))
})

test('configDir', () => {
  expect(Platform.configDir).toEqual(expect.any(String))
})

test('cacheDir', () => {
  expect(Platform.cacheDir).toEqual(expect.any(String))
})

test('homeDir', () => {
  expect(Platform.homeDir).toEqual(expect.any(String))
})

test('getCachedExtensionsPath', () => {
  expect(Platform.getCachedExtensionsPath()).toEqual(expect.any(String))
})

test('getBuiltinExtensionsPath', () => {
  expect(Platform.getBuiltinExtensionsPath()).toEqual(expect.any(String))
})

test('getDisabledExtensionsPath', () => {
  expect(Platform.getDisabledExtensionsPath()).toEqual(expect.any(String))
})

test('getMarketplaceUrl', () => {
  expect(Platform.getMarketplaceUrl()).toEqual(expect.any(String))
})

test('getDesktop', () => {
  expect(Platform.getDesktop()).toEqual(expect.any(String))
})

test('getPathSeparator', () => {
  expect(Platform.getPathSeparator()).toEqual(expect.any(String))
})

test('getLogsDir', () => {
  expect(Platform.getLogsDir()).toEqual(expect.any(String))
})

test('getUserSettingsPath', () => {
  expect(Platform.getUserSettingsPath()).toEqual(expect.any(String))
})

test('getRecentlyOpenedPath', () => {
  expect(Platform.getRecentlyOpenedPath()).toEqual(expect.any(String))
})
