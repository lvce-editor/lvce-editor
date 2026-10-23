import { beforeEach, expect, test } from '@jest/globals'
import * as Platform from '../src/parts/Platform/Platform.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'
import * as RuntimeConfig from '../src/parts/RuntimeConfig/RuntimeConfig.ts'

beforeEach(() => {
  RuntimeConfig.initialize()
})

test('uses a numeric configured platform', () => {
  RuntimeConfig.initialize({ platform: PlatformType.Electron })

  expect(Platform.getPlatform()).toBe(PlatformType.Electron)
})

test.each([
  ['electron', PlatformType.Electron],
  ['remote', PlatformType.Remote],
  ['web', PlatformType.Web],
] as const)('normalizes the configured %s platform', (configuredPlatform, expectedPlatform) => {
  RuntimeConfig.initialize({ platform: configuredPlatform })

  expect(Platform.getPlatform()).toBe(expectedPlatform)
})

test('falls back to the test platform when no platform is configured', () => {
  expect(Platform.getPlatform()).toBe(PlatformType.Test)
})
