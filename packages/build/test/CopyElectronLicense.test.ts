import { readFile, rm, mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import * as CopyElectronLicense from '../src/parts/CopyElectronLicense/CopyElectronLicense.ts'

test('copyElectronLicense copies the application licenses into the Electron app root', async () => {
  const resourcesPath = await mkdtemp(join(tmpdir(), 'lvce-electron-resources-'))
  try {
    await CopyElectronLicense.copyElectronLicense({ resourcesPath })

    const license = await readFile(join(resourcesPath, 'app', 'LICENSE'), 'utf8')
    const thirdPartyNotices = await readFile(join(resourcesPath, 'app', 'ThirdPartyNotices.txt'), 'utf8')

    expect(license).toBe(await readFile(new URL('../../../LICENSE', import.meta.url), 'utf8'))
    expect(thirdPartyNotices).toBe(await readFile(new URL('../../../ThirdPartyNotices.txt', import.meta.url), 'utf8'))
    expect(thirdPartyNotices).not.toBe('')
  } finally {
    await rm(resourcesPath, { force: true, recursive: true })
  }
})
