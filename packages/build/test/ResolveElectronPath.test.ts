import { describe, expect, test } from '@jest/globals'
import { join } from 'path'
import { resolveElectronLaunch } from '../src/parts/ResolveElectronPath/ResolveElectronPath.ts'

describe('resolveElectronLaunch', () => {
  test('uses electron cli script when available', () => {
    const electronCliPath = join('/workspace', 'packages', 'main-process', 'node_modules', 'electron', 'cli.js')
    const electronLaunch = resolveElectronLaunch({
      root: '/workspace',
      platform: 'linux',
      nodePath: '/usr/bin/node',
      existsSyncFn: (path) => path === electronCliPath,
    })

    expect(electronLaunch).toEqual({
      command: '/usr/bin/node',
      argsPrefix: [electronCliPath],
    })
  })

  test('falls back to legacy linux dist path when electron cli is unavailable', () => {
    const electronLaunch = resolveElectronLaunch({
      root: '/workspace',
      platform: 'linux',
      existsSyncFn: () => false,
    })

    expect(electronLaunch).toEqual({
      command: join('/workspace', 'packages', 'main-process', 'node_modules', 'electron', 'dist', 'electron'),
      argsPrefix: [],
    })
  })

  test('falls back to legacy macOS app bundle path when electron cli is unavailable', () => {
    const electronLaunch = resolveElectronLaunch({
      root: '/workspace',
      platform: 'darwin',
      existsSyncFn: () => false,
    })

    expect(electronLaunch).toEqual({
      command: join('/workspace', 'packages', 'main-process', 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron'),
      argsPrefix: [],
    })
  })

  test('falls back to legacy windows dist path when electron cli is unavailable', () => {
    const electronLaunch = resolveElectronLaunch({
      root: '/workspace',
      platform: 'win32',
      existsSyncFn: () => false,
    })

    expect(electronLaunch).toEqual({
      command: join('/workspace', 'packages', 'main-process', 'node_modules', 'electron', 'dist', 'electron.exe'),
      argsPrefix: [],
    })
  })
})
