import { describe, expect, test } from '@jest/globals'
import { resolveElectronPath } from '../src/parts/ResolveElectronPath/ResolveElectronPath.js'

describe('resolveElectronPath', () => {
  test('uses the executable path exported by electron package', () => {
    const electronPath = resolveElectronPath({
      root: '/workspace',
      platform: 'linux',
      requireFromMainProcess: () => '/workspace/packages/main-process/node_modules/electron/dist/electron',
      existsSyncFn: path => path === '/workspace/packages/main-process/node_modules/electron/dist/electron',
    })

    expect(electronPath).toBe('/workspace/packages/main-process/node_modules/electron/dist/electron')
  })

  test('falls back to legacy linux dist path when package entrypoint is unavailable', () => {
    const electronPath = resolveElectronPath({
      root: '/workspace',
      platform: 'linux',
      requireFromMainProcess: () => {
        throw new Error('Cannot find module')
      },
    })

    expect(electronPath).toBe('/workspace/packages/main-process/node_modules/electron/dist/electron')
  })

  test('falls back to legacy macOS app bundle path when package entrypoint is unavailable', () => {
    const electronPath = resolveElectronPath({
      root: '/workspace',
      platform: 'darwin',
      requireFromMainProcess: () => {
        throw new Error('Cannot find module')
      },
    })

    expect(electronPath).toBe('/workspace/packages/main-process/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron')
  })

  test('falls back when electron package returns a missing path', () => {
    const electronPath = resolveElectronPath({
      root: '/workspace',
      platform: 'win32',
      requireFromMainProcess: () => 'C:/workspace/packages/main-process/node_modules/electron/dist/electron.exe',
      existsSyncFn: () => false,
    })

    expect(electronPath).toBe('/workspace/packages/main-process/node_modules/electron/dist/electron.exe')
  })
})