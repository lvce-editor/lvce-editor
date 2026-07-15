import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/MenuWorker/MenuWorker.js', () => ({
  invoke: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js', () => ({
  hide: jest.fn(),
  show: jest.fn(),
}))

const MenuWorker = await import('../src/parts/MenuWorker/MenuWorker.js')
const SimpleBrowserOverlay = await import('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js')
const Menu = await import('../src/parts/Menu/Menu.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('show hides the Simple Browser while a menu is open', async () => {
  await Menu.show(10, 20, 'EditorContextMenu', 'arg')

  expect(SimpleBrowserOverlay.show).toHaveBeenCalledWith('menu')
  expect(MenuWorker.invoke).toHaveBeenCalledWith('Menu.show', 'EditorContextMenu', 10, 20, 'arg')
})

test('show2 hides the Simple Browser while a menu is open', async () => {
  await Menu.show2(7, 'EditorContextMenu', 10, 20, 'arg')

  expect(SimpleBrowserOverlay.show).toHaveBeenCalledWith('menu')
  expect(MenuWorker.invoke).toHaveBeenCalledWith('Menu.show2', 7, 'EditorContextMenu', 10, 20, 'arg')
})

test('hide restores the Simple Browser even when hiding the menu fails', async () => {
  // @ts-ignore
  MenuWorker.invoke.mockRejectedValue(new Error('failed'))

  await expect(Menu.hide()).rejects.toThrow('failed')
  expect(SimpleBrowserOverlay.hide).toHaveBeenCalledWith('menu')
})
