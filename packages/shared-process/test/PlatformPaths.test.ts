import { beforeEach, expect, test } from '@jest/globals'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as PlatformPaths from '../src/parts/PlatformPaths/PlatformPaths.js'
import * as Root from '../src/parts/Root/Root.js'

const originalTestPath = process.env.TEST_PATH

beforeEach(() => {
  if (originalTestPath === undefined) {
    delete process.env.TEST_PATH
  } else {
    process.env.TEST_PATH = originalTestPath
  }
})

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

test('getTestPath - uses absolute TEST_PATH', () => {
  process.env.TEST_PATH = '/home/simon/Documents/levivilet/chat-view/packages/e2e'

  expect(PlatformPaths.getTestPath()).toEqual('/remote' + pathToFileURL('/home/simon/Documents/levivilet/chat-view/packages/e2e').toString().slice(7))
})

test('getTestPath - resolves relative TEST_PATH from cwd', () => {
  process.env.TEST_PATH = 'packages/e2e'

  expect(PlatformPaths.getTestPath()).toEqual('/remote' + pathToFileURL(join(process.cwd(), 'packages/e2e')).toString().slice(7))
})

test('getTestPath - falls back to extension-host-worker-tests', () => {
  delete process.env.TEST_PATH

  expect(PlatformPaths.getTestPath()).toEqual('/remote' + pathToFileURL(join(Root.root, 'packages', 'extension-host-worker-tests')).toString().slice(7))
})
