import { expect, test } from '@jest/globals'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as ExtensionManifestInputType from '../src/parts/ExtensionManifestInputType/ExtensionManifestInputType.js'
import * as GetExtensionEtags from '../src/parts/GetExtensionEtags/GetExtensionEtags.js'

test('getExtensionEtags includes a transient linked extension', async () => {
  const extensionPath = await mkdtemp(join(tmpdir(), 'linked-extension-etag-'))
  const manifestContent = JSON.stringify({ id: 'builtin.test-extension' })
  await writeFile(join(extensionPath, 'extension.json'), manifestContent)

  const etags = await GetExtensionEtags.getExtensionEtags([
    {
      path: extensionPath,
      type: ExtensionManifestInputType.LinkedExtension,
    },
  ])

  expect(etags).toHaveLength(1)
  expect(etags[0].size).toBe(manifestContent.length)
  expect(etags[0].mtime.getTime()).toEqual(expect.any(Number))
})
