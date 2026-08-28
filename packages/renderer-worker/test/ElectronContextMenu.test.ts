import { beforeEach, expect, jest, test } from '@jest/globals'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/MenuEntries/MenuEntries.js', () => ({
  getMenuEntries: jest.fn(),
  getMenuEntries2: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invoke: jest.fn(),
}))

const Command = await import('../src/parts/Command/Command.js')
const ElectronContextMenu = await import('../src/parts/ElectronContextMenu/ElectronContextMenu.js')
const MenuEntries = await import('../src/parts/MenuEntries/MenuEntries.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')

test('converts disabled browser actions to disabled native menu items', async () => {
  jest
    .mocked(MenuEntries.getMenuEntries)
    .mockResolvedValue([{ command: 'SimpleBrowser.backward', flags: MenuItemFlags.Disabled, id: 'back', label: 'Back' }])
  jest.mocked(SharedProcess.invoke).mockResolvedValue({ type: 'close' })

  await ElectronContextMenu.openContextMenu(10, 20, 1)

  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronContextMenu.openContextMenu', [{ enabled: false, label: 'Back' }], 10, 20)
})

test('passes disabled entries to the native context menu and does not execute them', async () => {
  // @ts-ignore
  MenuEntries.getMenuEntries2.mockResolvedValue([
    {
      command: 'Viewlet.executeViewletCommand',
      flags: MenuItemFlags.Disabled,
      label: 'Close Tabs to the Left',
    },
  ])
  // @ts-ignore
  SharedProcess.invoke.mockResolvedValue({ data: 'Close Tabs to the Left', type: 'select' })

  await ElectronContextMenu.openContextMenu2(100, 200, 42, 32, 0)

  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ElectronContextMenu.openContextMenu',
    [{ enabled: false, label: 'Close Tabs to the Left' }],
    100,
    200,
  )
  expect(Command.execute).not.toHaveBeenCalled()
})
