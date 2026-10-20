import { win32 } from 'node:path'
import { expect, test } from '@jest/globals'
import { getNativeDependencyCachePath } from '../src/parts/GetNativeDependencyCachePath/GetNativeDependencyCachePath.ts'

test('keeps native addon MSBuild directories and generated files below Windows path limits', () => {
  const root = String.raw`D:\a\lvce-editor\lvce-editor`
  const hash = 'e875f25a25c1a528c3bc8db240c065c4b4a13843'
  const cachePath = getNativeDependencyCachePath(root, hash)
  const directory = win32.join(
    cachePath,
    'shared-process/node_modules/@vscode/windows-process-tree/build/node_modules/node-addon-api/Release/obj/node_addon_api_except/node_add.D2CBEAB7.tlog',
  )
  expect(directory.length).toBeLessThan(248)
  for (const name of ['node_addon_api_except.lastbuildstate', 'node_addon_api_except.write.1u.tlog', 'node_addon_api_except.unsuccessfulbuild']) {
    expect(win32.join(directory, name).length).toBeLessThan(260)
  }
  expect(Buffer.from(win32.basename(cachePath), 'base64url').toString('hex')).toBe(hash)
})
