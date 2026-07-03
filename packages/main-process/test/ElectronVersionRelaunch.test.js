// @ts-nocheck
import { describe, expect, test } from '@jest/globals'
import { ensureElectronVersion } from '../src/parts/ElectronVersionCache/ElectronVersionCache.js'
import { parseElectronVersionCliArgs } from '../src/parts/ElectronVersionCliArgs/ElectronVersionCliArgs.js'
import {
  getElectronExecutablePath,
  getElectronUserArgv,
  getElectronVersionCachePath,
} from '../src/parts/ElectronVersionPaths/ElectronVersionPaths.js'

describe('electron version relaunch cli args', () => {
  test('parses equals form and removes flag from forwarded args', () => {
    expect(parseElectronVersionCliArgs(['--electron-version=42.0.0', '--foo'])).toEqual({
      electronVersion: '42.0.0',
      filteredArgv: ['--foo'],
    })
  })

  test('parses space-separated form', () => {
    expect(parseElectronVersionCliArgs(['--electron-version', '42.0.0', '/workspace'])).toEqual({
      electronVersion: '42.0.0',
      filteredArgv: ['/workspace'],
    })
  })

  test('parses camelCase alias and normalizes leading v', () => {
    expect(parseElectronVersionCliArgs(['--electronVersion=v42.0.0'])).toEqual({
      electronVersion: '42.0.0',
      filteredArgv: [],
    })
  })

  test('throws for missing version value', () => {
    expect(() => parseElectronVersionCliArgs(['--electron-version'])).toThrow('--electron-version requires an Electron version')
    expect(() => parseElectronVersionCliArgs(['--electronVersion', '--foo'])).toThrow('--electronVersion requires an Electron version')
  })
})

describe('electron version relaunch paths', () => {
  test('resolves platform executable paths', () => {
    expect(getElectronExecutablePath({ electronPath: '/cache/electron', platform: 'linux' })).toBe('/cache/electron/electron')
    expect(getElectronExecutablePath({ electronPath: '/cache/electron', platform: 'win32' })).toBe('/cache/electron/electron.exe')
    expect(getElectronExecutablePath({ electronPath: '/cache/electron', platform: 'darwin' })).toBe(
      '/cache/electron/Electron.app/Contents/MacOS/Electron',
    )
  })

  test('uses dev cache when LVCE_ROOT is available', () => {
    expect(
      getElectronVersionCachePath({
        arch: 'x64',
        electronVersion: '42.0.0',
        platform: 'linux',
        userDataPath: '/user-data',
        lvceRoot: '/workspace',
      }),
    ).toBe('/workspace/build/.tmp/cachedElectronVersions/electron-42.0.0-linux-x64')
  })

  test('uses userData cache without LVCE_ROOT', () => {
    expect(
      getElectronVersionCachePath({
        arch: 'arm64',
        electronVersion: '42.0.0',
        platform: 'darwin',
        userDataPath: '/user-data',
        lvceRoot: '',
      }),
    ).toBe('/user-data/electronVersions/electron-42.0.0-darwin-arm64')
  })

  test('removes the app path from Electron argv', () => {
    expect(
      getElectronUserArgv({
        appPath: '/workspace/packages/main-process',
        argv: ['/usr/bin/electron', '.', '--electron-version=42.0.0'],
        cwd: '/workspace/packages/main-process',
      }),
    ).toEqual(['--electron-version=42.0.0'])
  })
})

describe('electron version cache', () => {
  test('redownloads when cache exists without platform executable', async () => {
    const cachePath = '/cache/electron-42.0.0-linux-x64'
    const executablePath = '/cache/electron-42.0.0-linux-x64/electron'
    const existingPaths = new Set([cachePath])
    const calls = []
    const result = await ensureElectronVersion({
      arch: 'x64',
      cachePath,
      electronVersion: '42.0.0',
      existsSyncFn(path) {
        return existingPaths.has(path)
      },
      async downloadArtifactFn() {
        calls.push('download')
        return '/tmp/electron.zip'
      },
      async extractZipFn() {
        calls.push('extract')
        existingPaths.add(executablePath)
      },
      async mkdirFn(path) {
        calls.push(`mkdir:${path}`)
        existingPaths.add(path)
      },
      platform: 'linux',
      async rmFn(path) {
        calls.push(`rm:${path}`)
        existingPaths.delete(path)
      },
    })

    expect(result).toBe(executablePath)
    expect(calls).toEqual([`rm:${cachePath}`, `mkdir:${cachePath}`, 'download', 'extract'])
  })
})
