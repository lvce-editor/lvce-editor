import { describe, expect, test } from '@jest/globals'
import * as GetWindowsUnpackedDir from '../src/parts/GetWindowsUnpackedDir/GetWindowsUnpackedDir.ts'

describe('getWindowsUnpackedDir', () => {
  test.each([
    ['x64', 'win-unpacked'],
    ['arm64', 'win-arm64-unpacked'],
  ])('returns the electron-builder output directory for %s', (arch, expected) => {
    expect(GetWindowsUnpackedDir.getWindowsUnpackedDir(arch)).toBe(expected)
  })
})
