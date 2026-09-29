import { expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: () => PlatformType.Electron,
}))

const Command = await import('../src/parts/Command/Command.js')
const ToggleFullScreen = await import('../src/parts/ToggleFullScreen/ToggleFullScreen.js')

test('toggleFullScreen - electron', async () => {
  await ToggleFullScreen.toggleFullScreen()

  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('ElectronWindow.toggleFullScreen')
})
