import { expect, test } from '@jest/globals'
import * as GetExtensionAbsolutePath from '../src/parts/GetExtensionAbsolutePath/GetExtensionAbsolutePath.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

test('getExtensionAbsolutePath handles file urls for local extensions', () => {
  const absolutePath = GetExtensionAbsolutePath.getExtensionAbsolutePath(
    'builtin.git',
    false,
    false,
    'file:///D:/a/git/git/packages/extension',
    'src/gitMain.js',
    'http://localhost:3000',
    PlatformType.Electron,
  )

  expect(absolutePath).toBe('http://localhost:3000/remote/D:/a/git/git/packages/extension/src/gitMain.js')
})
