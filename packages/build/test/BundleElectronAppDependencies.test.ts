import { createRequire } from 'node:module'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/BundleExtensionHostHelperProcessDependencies/BundleExtensionHostHelperProcessDependencies.ts', () => ({
  bundleExtensionHostHelperProcessDependencies: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/BundleSharedProcessDependencies/BundleSharedProcessDependencies.ts', () => ({
  bundleSharedProcessDependencies: jest.fn(),
}))

const { bundleElectronAppDependencies } = await import('../src/parts/BundleElectronAppDependencies/BundleElectronAppDependencies.ts')

test('bundled main process includes external runtime dependencies', async () => {
  const cachePath = await mkdtemp(join(tmpdir(), 'lvce-electron-dependencies-'))
  try {
    await bundleElectronAppDependencies({
      cachePath,
      arch: 'x64',
      electronVersion: '43.1.0',
      product: {},
      supportsAutoUpdate: false,
      bundleMainProcess: true,
      platform: 'linux',
      target: 'electron-deb',
    })

    const packagedMainProcessPath = join(cachePath, 'main-process', 'dist', 'mainProcessMain.js')
    expect(createRequire(packagedMainProcessPath).resolve('dbus-native')).toBe(
      join(cachePath, 'main-process', 'node_modules', 'dbus-native', 'index.js'),
    )
  } finally {
    await rm(cachePath, { recursive: true, force: true })
  }
})
