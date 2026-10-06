import { readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import { bundleSharedProcessCached } from '../src/parts/BundleSharedProcessCached/BundleSharedProcessCached.ts'

test('keeps server and Electron shared-process artifacts separate and reuses matching builds', async () => {
  const options = {
    commitHash: 'cache-target-regression',
    product: { applicationName: 'lvce-oss', nameLong: 'Lvce Editor - OSS' },
    version: '0.0.0-test',
    date: 'cache-target-regression',
    bundleSharedProcess: false,
    isArchLinux: false,
    isAppImage: false,
  }
  const paths = new Set<string>()
  try {
    const serverPath = await bundleSharedProcessCached({ ...options, target: 'server' })
    paths.add(serverPath)
    expect(await readFile(join(serverPath, 'src/parts/Root/Root.js'), 'utf8')).toContain("resolve(__dirname, '../../../')")

    const electronPath = await bundleSharedProcessCached({ ...options, target: 'electron-deb' })
    paths.add(electronPath)
    expect(electronPath).not.toBe(serverPath)
    expect(await readFile(join(electronPath, 'src/parts/Root/Root.js'), 'utf8')).toContain("resolve(__dirname, '../../../../../')")
    expect(await readFile(join(electronPath, 'src/parts/PlatformPaths/PlatformPaths.js'), 'utf8')).toContain(
      "Path.join(Root.root, 'static', 'cache-target-regression', 'config', 'defaultSettings.json')",
    )
    const marker = join(electronPath, 'cache-marker')
    await writeFile(marker, 'cached artifact')
    expect(await bundleSharedProcessCached({ ...options, target: 'electron-deb' })).toBe(electronPath)
    expect(await readFile(marker, 'utf8')).toBe('cached artifact')
  } finally {
    for (const path of paths) await rm(path, { recursive: true, force: true })
  }
}, 30_000)
