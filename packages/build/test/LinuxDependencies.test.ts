import { expect, test } from '@jest/globals'
import * as LinuxDependencies from '../src/parts/LinuxDependencies/LinuxDependencies.ts'

test('Debian package installs terminal Unicode fallback fonts', () => {
  expect(LinuxDependencies.defaultDepends).toContain('fonts-noto-cjk')
  expect(LinuxDependencies.defaultDepends).toContain('fonts-noto-color-emoji')
})
