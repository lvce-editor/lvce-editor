import * as AssetDir from '../src/parts/AssetDir/AssetDir.ts'
import { test, expect } from '@jest/globals'

test('assetDir', () => {
  expect(typeof AssetDir.assetDir).toBe('string')
})
