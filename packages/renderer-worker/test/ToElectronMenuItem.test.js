import * as ToElectronMenuItem from '../src/parts/ToElectronMenuItem/ToElectronMenuItem.js'

test('Help', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      name: 'Help',
    })
  ).toEqual({
    role: 'help',
  })
})

test('File', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      name: 'File',
    })
  ).toEqual({
    role: 'fileMenu',
  })
})

test('Edit', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      name: 'Edit',
    })
  ).toEqual({
    role: 'editMenu',
  })
})

test('Exit', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'Exit',
    })
  ).toEqual({
    role: 'quit',
  })
})

test('Undo', () => {
  expect(
    ToElectronMenuItem.toElectronMenuItem({
      label: 'Undo',
    })
  ).toEqual({
    role: 'undo',
  })
})
