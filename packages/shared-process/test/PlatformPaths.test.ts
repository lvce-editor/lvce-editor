import { expect, test } from '@jest/globals'
import * as PlatformPaths from '../src/parts/PlatformPaths/PlatformPaths.js'

test('dataDir', () => {
  expect(PlatformPaths.dataDir).toEqual(expect.any(String))
})

test('configDir', () => {
  expect(PlatformPaths.configDir).toEqual(expect.any(String))
})

test('cacheDir', () => {
  expect(PlatformPaths.cacheDir).toEqual(expect.any(String))
})

test('homeDir', () => {
  expect(PlatformPaths.homeDir).toEqual(expect.any(String))
})

test('getCachedExtensionsPath', () => {
  expect(PlatformPaths.getCachedExtensionsPath()).toEqual(expect.any(String))
})

test('getBuiltinExtensionsPath', () => {
  expect(PlatformPaths.getBuiltinExtensionsPath()).toEqual(expect.any(String))
})

test('getDisabledExtensionsPath', () => {
  expect(PlatformPaths.getDisabledExtensionsPath()).toEqual(expect.any(String))
})

test('getMarketplaceUrl', () => {
  expect(PlatformPaths.getMarketplaceUrl()).toEqual(expect.any(String))
})

test('getPathSeparator', () => {
  expect(PlatformPaths.getPathSeparator()).toEqual(expect.any(String))
})

test('getLogsDir', () => {
  expect(PlatformPaths.getLogsDir()).toEqual(expect.any(String))
})

test('getUserSettingsPath', () => {
  expect(PlatformPaths.getUserSettingsPath()).toEqual(expect.any(String))
})

test('getRecentlyOpenedPath', () => {
  expect(PlatformPaths.getRecentlyOpenedPath()).toEqual(expect.any(String))
})
