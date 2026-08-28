import { expect, jest, test } from '@jest/globals'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

jest.unstable_mockModule('../src/parts/MenuEntries/MenuEntries.js', () => ({
  getMenuEntries: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invoke: jest.fn(),
}))

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
