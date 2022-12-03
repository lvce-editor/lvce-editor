import * as ElectronMenuItemRole from '../src/parts/ElectronMenuItemRole/ElectronMenuItemRole.js'
import * as ElectronMenuItemType from '../src/parts/ElectronMenuItemType/ElectronMenuItemType.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as ToElectronMenuItem from '../src/parts/ToElectronMenuItem/ToElectronMenuItem.js'

test('Help', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'Help',
    })
  ).toEqual({
    label: 'Help',
    role: ElectronMenuItemRole.Help,
    submenu: [],
  })
})

test('File', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'File',
    })
  ).toEqual({
    label: 'File',
    role: ElectronMenuItemRole.FileMenu,
    submenu: [],
  })
})

test('Edit', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'Edit',
    })
  ).toEqual({
    label: 'Edit',
    role: ElectronMenuItemRole.EditMenu,
    submenu: [],
  })
})

test('Exit', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'Exit',
    })
  ).toEqual({
    label: 'Exit',
    role: ElectronMenuItemRole.Quit,
  })
})

test('Undo', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'Undo',
    })
  ).toEqual({
    label: 'Undo',
    role: ElectronMenuItemRole.Undo,
  })
})

test('Separator', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      flags: MenuItemFlags.Separator,
    })
  ).toEqual({
    type: ElectronMenuItemType.Separator,
  })
})

test('SubMenu', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'test',
      flags: MenuItemFlags.SubMenu,
    })
  ).toEqual({
    label: 'test',
    type: ElectronMenuItemType.SubMenu,
    submenu: [],
  })
})
