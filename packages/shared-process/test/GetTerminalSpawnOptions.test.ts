import { expect, jest, test } from '@jest/globals'

const platform = { isWindows: false, isMacOs: false }
jest.unstable_mockModule('../src/parts/Platform/Platform.ts', () => platform)

test.each([
  [false, true, { command: 'zsh', args: ['-il'] }],
  [false, false, { command: 'bash', args: ['-i'] }],
  [true, false, { command: 'powershell.exe', args: [] }],
])('terminal shell options (Windows=%s, macOS=%s)', async (isWindows, isMacOs, expected) => {
  jest.resetModules()
  platform.isWindows = isWindows as boolean
  platform.isMacOs = isMacOs as boolean
  const { getTerminalSpawnOptions } = await import('../src/parts/GetTerminalSpawnOptions/GetTerminalSpawnOptions.ts')
  expect(getTerminalSpawnOptions()).toEqual(expected)
})
