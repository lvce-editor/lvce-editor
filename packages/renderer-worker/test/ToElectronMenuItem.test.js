import * as ToElectronMenuItem from '../src/parts/ToElectronMenuItem/ToElectronMenuItem.js'
import * as ElectronMenuItemType from '../src/parts/ElectronMenuItemType/ElectronMenuItemType.js'

test('Help', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      name: 'Help',
    })
  ).toEqual({
    role: ElectronMenuItemType.Help,
  })
})

test('File', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      name: 'File',
    })
  ).toEqual({
    role: ElectronMenuItemType.FileMenu,
  })
})

test('Edit', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      name: 'Edit',
    })
  ).toEqual({
    role: ElectronMenuItemType.EditMenu,
  })
})

test('Exit', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'Exit',
    })
  ).toEqual({
    role: ElectronMenuItemType.Quit,
  })
})

test('Undo', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'Undo',
    })
  ).toEqual({
    role: ElectronMenuItemType.Undo,
  })
})
