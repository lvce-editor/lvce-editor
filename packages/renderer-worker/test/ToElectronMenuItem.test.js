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
    role: ElectronMenuItemRole.Help,
  })
})

test('File', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'File',
    })
  ).toEqual({
    role: ElectronMenuItemRole.FileMenu,
  })
})

test('Edit', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'Edit',
    })
  ).toEqual({
    role: ElectronMenuItemRole.EditMenu,
  })
})

test('Exit', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'Exit',
    })
  ).toEqual({
    role: ElectronMenuItemRole.Quit,
  })
})

test('Undo', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'Undo',
    })
  ).toEqual({
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
      flags: MenuItemFlags.SubMenu,
    })
  ).toEqual({
    type: ElectronMenuItemType.SubMenu,
  })
})
