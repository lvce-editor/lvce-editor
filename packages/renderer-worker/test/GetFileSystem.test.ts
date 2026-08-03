import { expect, test } from '@jest/globals'
import * as FileSystemState from '../src/parts/FileSystemState/FileSystemState.js'
import * as GetFileSystem from '../src/parts/GetFileSystem/GetFileSystem.js'

test('registered built-in file systems take precedence', async () => {
  const builtin = { name: 'builtin' }
  const extensionHost = { name: 'extension-host' }
  FileSystemState.registerAll({
    'extension-host': async () => extensionHost,
    'test-builtin': async () => builtin,
  })

  await expect(GetFileSystem.getFileSystem('test-builtin')).resolves.toBe(builtin)
})

test('unknown schemes use the extension host file system', async () => {
  const extensionHost = { name: 'extension-host' }
  FileSystemState.registerAll({
    'extension-host': async () => extensionHost,
  })

  await expect(GetFileSystem.getFileSystem('remote-ssh')).resolves.toBe(extensionHost)
})
