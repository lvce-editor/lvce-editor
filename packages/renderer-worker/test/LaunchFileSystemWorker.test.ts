import { expect, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'
import { getFileSystemPlatform } from '../src/parts/LaunchFileSystemWorker/LaunchFileSystemWorker.js'

test('uses the current platform for a local workspace', () => {
  expect(getFileSystemPlatform(PlatformType.Web, false)).toBe(PlatformType.Web)
})

test('uses the remote platform for a connected workspace', () => {
  expect(getFileSystemPlatform(PlatformType.Web, true)).toBe(PlatformType.Remote)
})
