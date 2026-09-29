import { expect, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'
import * as Process from '../src/parts/Process/Process.js'

test('getArgv reads argv from the shared process on a remote server', () => {
  expect(Process.getArgvCommand(PlatformType.Remote)).toBe('Process.getArgv')
})

test('getArgv reads argv from the Electron main process in Electron', () => {
  expect(Process.getArgvCommand(PlatformType.Electron)).toBe('ElectronProcess.getArgv')
})
