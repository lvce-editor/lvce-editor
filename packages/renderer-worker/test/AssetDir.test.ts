import { afterEach, expect, test } from '@jest/globals'
import * as AssetDir from '../src/parts/AssetDir/AssetDir.js'
import * as RuntimeConfig from '../src/parts/RuntimeConfig/RuntimeConfig.ts'

afterEach(() => {
  RuntimeConfig.initialize()
  AssetDir.initialize()
})

test('initializes the asset prefix even when imported before runtime configuration arrives', () => {
  RuntimeConfig.initialize({ assetDir: '/extension-samples/runtime/release', platform: 'web' })
  AssetDir.initialize()
  expect(AssetDir.assetDir).toBe('/extension-samples/runtime/release')
  RuntimeConfig.initialize({ assetDir: '/another-host/runtime/release', platform: 'web' })
  AssetDir.initialize()
  expect(AssetDir.assetDir).toBe('/another-host/runtime/release')
})
