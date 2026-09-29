import { afterEach, expect, jest, test } from '@jest/globals'
import { EventEmitter } from 'node:events'
import * as LinkedExtensionDevServers from '../src/parts/LinkedExtensionDevServers/LinkedExtensionDevServers.js'

class MockChildProcess extends EventEmitter {
  kill = jest.fn()
}

afterEach(() => {
  LinkedExtensionDevServers.dispose()
})

test('startDevServers - starts each unique linked extension dev script with inherited output', async () => {
  const child = new MockChildProcess()
  const readPackage = jest.fn(async () => ({ scripts: { dev: 'esbuild --watch' } }))
  const spawn = jest.fn((_command: string, _args: readonly string[], _options: { cwd: string; stdio: 'inherit' }) => child as any)

  await LinkedExtensionDevServers.startDevServers([{ resolvedPath: '/extension' }, { resolvedPath: '/extension' }], readPackage, spawn)

  expect(readPackage).toHaveBeenCalledTimes(1)
  expect(spawn).toHaveBeenCalledTimes(1)
  expect(spawn).toHaveBeenCalledWith(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    cwd: '/extension',
    stdio: 'inherit',
  })
})

test('startDevServers - skips packages without a dev script', async () => {
  const readPackage = jest.fn(async () => ({ scripts: { build: 'esbuild' } }))
  const spawn = jest.fn()

  await LinkedExtensionDevServers.startDevServers([{ resolvedPath: '/extension' }], readPackage, spawn as any)

  expect(spawn).not.toHaveBeenCalled()
})

test('dispose - stops running linked extension dev scripts', async () => {
  const child = new MockChildProcess()
  await LinkedExtensionDevServers.startDevServers(
    [{ resolvedPath: '/extension' }],
    async () => ({ scripts: { dev: 'esbuild --watch' } }),
    () => child as any,
  )

  LinkedExtensionDevServers.dispose()

  expect(child.kill).toHaveBeenCalledTimes(1)
})
