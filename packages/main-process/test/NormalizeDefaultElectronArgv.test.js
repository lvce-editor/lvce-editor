import { expect, test } from '@jest/globals'
import { normalizeDefaultElectronArgv } from '../src/normalizeDefaultElectronArgv.js'

test('removes the app path when launched by a default Electron executable', () => {
  const argv = ['/path/to/electron', '/path/to/app', '--wait']
  normalizeDefaultElectronArgv(argv, true)
  expect(argv).toEqual(['/path/to/electron', '--wait'])
})

test('preserves packaged Electron arguments', () => {
  const argv = ['/path/to/lvce-oss', '--wait']
  normalizeDefaultElectronArgv(argv, undefined)
  expect(argv).toEqual(['/path/to/lvce-oss', '--wait'])
})
