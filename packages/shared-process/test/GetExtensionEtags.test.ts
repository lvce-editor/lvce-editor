import { expect, test } from '@jest/globals'
import { mkdtemp, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as ExtensionManifestInputType from '../src/parts/ExtensionManifestInputType/ExtensionManifestInputType.js'
import * as GetExtensionEtags from '../src/parts/GetExtensionEtags/GetExtensionEtags.js'

const getTmpDir = (): Promise<string> => {
  return mkdtemp(join(tmpdir(), 'linked-extension-etag-'))
}

test('getExtensionEtags includes linked extension symlinks', async () => {
  const linkedExtensionsPath = await getTmpDir()
  const extensionPath = await getTmpDir()
  const manifestContent = JSON.stringify({ id: 'builtin.test-extension' })
  await writeFile(join(extensionPath, 'extension.json'), manifestContent)
  await symlink(extensionPath, join(linkedExtensionsPath, 'builtin.test-extension'))

  const etags = await GetExtensionEtags.getExtensionEtags([
    {
      path: linkedExtensionsPath,
      type: ExtensionManifestInputType.LinkedExtensionsFolder,
    },
  ])

  expect(etags).toHaveLength(1)
  expect(etags[0].size).toBe(manifestContent.length)
  expect(etags[0].mtime.getTime()).toEqual(expect.any(Number))
})
