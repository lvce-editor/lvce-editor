import { expect, jest, test } from '@jest/globals'

const platform = { isMacOs: false, isWindows: false }
jest.unstable_mockModule('../src/parts/Platform/Platform.ts', () => platform)

test.each([
  [false, true, { args: ['-il'], command: 'zsh' }],
  [false, false, { args: ['-i'], command: 'bash' }],
  [true, false, { args: [], command: 'powershell.exe' }],
])('terminal shell options (Windows=%s, macOS=%s)', async (isWindows, isMacOs, expected) => {
  jest.resetModules()
  platform.isWindows = isWindows
  platform.isMacOs = isMacOs
  const { getTerminalSpawnOptions } = await import('../src/parts/GetTerminalSpawnOptions/GetTerminalSpawnOptions.ts')
  expect(getTerminalSpawnOptions()).toEqual(expected)
})
