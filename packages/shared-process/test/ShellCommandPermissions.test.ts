import { beforeEach, expect, jest, test } from '@jest/globals'

const access = jest.fn(async () => {})
const lstat = jest.fn(async () => {
  throw Object.assign(new Error('missing'), { code: 'ENOENT' })
})
const mkdir = jest.fn(async () => {})
const symlink = jest.fn(async () => {})
jest.unstable_mockModule('node:fs/promises', () => ({ access, lstat, mkdir, readlink: jest.fn(), symlink }))
const platform = { applicationName: 'lvce', isMacOs: true }
const electron = { isElectron: true }
jest.unstable_mockModule('../src/parts/Platform/Platform.ts', () => platform)
jest.unstable_mockModule('../src/parts/IsElectron/IsElectron.ts', () => electron)
const { installLink } = await import('../src/parts/ShellCommand/ShellCommand.ts')

beforeEach(() => {
  jest.clearAllMocks()
  mkdir.mockResolvedValue(undefined)
  symlink.mockResolvedValue(undefined)
})

test.each(['EACCES', 'EPERM'])('requests elevation on %s', async (code) => {
  mkdir.mockRejectedValueOnce(Object.assign(new Error('permission denied'), { code }))
  const elevate = jest.fn(async () => {})
  await installLink('/Applications/lvce.app/bin/lvce', '/usr/local/bin/lvce', elevate)
  expect(elevate).toHaveBeenCalledTimes(1)
  expect(elevate).toHaveBeenCalledWith(expect.stringContaining('/bin/ln -s'))
})

test('permission refusal propagates to the caller', async () => {
  symlink.mockRejectedValueOnce(Object.assign(new Error('permission denied'), { code: 'EACCES' }))
  await expect(
    installLink('/app/bin/lvce', '/usr/local/bin/lvce', async () => {
      throw new Error('User canceled')
    }),
  ).rejects.toThrow('User canceled')
})

test('does not elevate unrelated filesystem errors', async () => {
  symlink.mockRejectedValueOnce(Object.assign(new Error('disk full'), { code: 'ENOSPC' }))
  const elevate = jest.fn(async () => {})
  await expect(installLink('/app/bin/lvce', '/usr/local/bin/lvce', elevate)).rejects.toThrow('disk full')
  expect(elevate).not.toHaveBeenCalled()
})

test.each([
  [true, true],
  [true, false],
  [false, true],
  [false, false],
])('only exposes installation in macOS Electron (%s, %s)', async (isMacOs, isElectron) => {
  jest.resetModules()
  platform.isMacOs = isMacOs
  electron.isElectron = isElectron
  const commands = await import('../src/parts/ShellCommand/ShellCommand.ts')
  if (isMacOs && isElectron) {
    expect(commands.getMenuEntries()).toEqual([{ id: 'ShellCommand.install', label: "Shell Command: Install 'lvce' command in PATH" }])
  } else {
    expect(commands.getMenuEntries()).toEqual([])
    await expect(commands.install()).rejects.toThrow('macOS desktop app')
  }
})
