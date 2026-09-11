import { expect, test } from '@jest/globals'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { getElectronVersion } from '../src/parts/GetElectronVersion/GetElectronVersion.ts'

test('the default build uses the Electron dependency supplied by main-process', async () => {
  const mainProcessRequire = createRequire(new URL('../../main-process/package.json', import.meta.url))
  const upstreamRequire = createRequire(mainProcessRequire.resolve('@lvce-editor/main-process/package.json'))
  const upstreamElectron = upstreamRequire('electron/package.json')

  expect(mainProcessRequire.resolve('electron/package.json')).toBe(upstreamRequire.resolve('electron/package.json'))
  await expect(getElectronVersion()).resolves.toEqual({
    electronVersion: upstreamElectron.version,
    isInstalled: true,
    installedArch: process.arch,
    installedPlatform: process.platform,
  })
})

test('the main-process wrapper does not declare a separate Electron version', async () => {
  const manifest = JSON.parse(await readFile(new URL('../../main-process/package.json', import.meta.url), 'utf8'))

  expect(manifest.dependencies).not.toHaveProperty('electron')
  expect(manifest.devDependencies).not.toHaveProperty('electron')
})
