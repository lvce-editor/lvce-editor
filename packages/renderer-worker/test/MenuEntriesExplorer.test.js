import * as MenuEntriesExplorer from '../src/parts/MenuEntriesExplorer/MenuEntriesExplorer.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

test('getMenuEntries - no focused dirent', () => {
  ViewletStates.set('Explorer', {
    state: {
      focusedIndex: -1,
      items: [],
    },
    factory: {},
  })
  const menuEntries = MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual(
    expect.objectContaining({
      label: 'New File',
      flags: MenuItemFlags.None,
    })
  )
  expect(menuEntries).toContainEqual(
    expect.objectContaining({
      label: 'Copy Path',

      flags: MenuItemFlags.RestoreFocus,
    })
  )
})

test('getMenuEntries - focused folder', () => {
  ViewletStates.set('Explorer', {
    state: {
      focusedIndex: 0,
      items: [
        {
          name: 'sample-folder',
          depth: 1,
          type: DirentType.Directory,
          path: '/sample-folder',
        },
      ],
    },
    factory: {},
  })
  const menuEntries = MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual(
    expect.objectContaining({
      label: 'New File',

      flags: MenuItemFlags.None,
    })
  )
})

test('getMenuEntries - focused file', () => {
  ViewletStates.set('Explorer', {
    state: {
      focusedIndex: 0,
      items: [
        {
          name: 'sample-file',
          depth: 1,
          type: 'file',
          path: '/sample-file',
        },
      ],
    },
    factory: {},
  })
  const menuEntries = MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual(
    expect.objectContaining({
      label: 'Copy',
      flags: MenuItemFlags.RestoreFocus,
    })
  )
  expect(menuEntries).not.toContainEqual(
    expect.objectContaining({
      label: 'New File',
      flags: MenuItemFlags.None,
    })
  )
})

test('getMenuEntries - focused symlink', () => {
  ViewletStates.set('Explorer', {
    state: {
      focusedIndex: 0,
      items: [
        {
          name: 'link',
          depth: 1,
          type: 'symlink',
          path: '/link',
        },
      ],
    },
    factory: {},
  })
  const menuEntries = MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual(
    expect.objectContaining({
      label: 'New File',
      flags: MenuItemFlags.None,
    })
  )
})

test('getMenuEntries - root', () => {
  ViewletStates.set('Explorer', {
    state: {
      focusedIndex: -1,
      items: [
        {
          name: 'link',
          depth: 1,
          type: 'symlink',
          path: '/link',
        },
      ],
    },
    factory: {},
  })
  const menuEntries = MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual(
    expect.objectContaining({
      label: 'New File',
      flags: MenuItemFlags.None,
    })
  )
  expect(menuEntries).not.toContainEqual(
    expect.objectContaining({
      label: 'Copy',
      flags: MenuItemFlags.RestoreFocus,
    })
  )
})
