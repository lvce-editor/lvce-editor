import * as ToElectronMenuItem from '../src/parts/ToElectronMenuItem/ToElectronMenuItem.js'
import * as ElectronMenuItemRole from '../src/parts/ElectronMenuItemRole/ElectronMenuItemRole.js'

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
