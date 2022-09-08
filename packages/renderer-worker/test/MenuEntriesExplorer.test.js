import * as MenuEntriesExplorer from '../src/parts/MenuEntries/MenuEntriesExplorer.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

test('getMenuEntries - no focused dirent', async () => {
  ViewletStates.set('Explorer', {
    state: {
      focusedIndex: -1,
      dirents: [],
    },
    factory: {},
  })
  const menuEntries = MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Explorer.newFile',
    flags: MenuItemFlags.None,
    id: 'newFile',
    label: 'New File',
  })
  expect(menuEntries).toContainEqual({
    command: 'Explorer.copyPath',
    flags: MenuItemFlags.RestoreFocus,
    id: 'copyPath',
    label: 'Copy Path',
  })
})

test('getMenuEntries - focused folder', async () => {
  ViewletStates.set('Explorer', {
    state: {
      focusedIndex: 0,
      dirents: [
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
  const menuEntries = await MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Explorer.newFile',
    flags: MenuItemFlags.None,
    id: 'newFile',
    label: 'New File',
  })
})

test('getMenuEntries - focused file', async () => {
  ViewletStates.set('Explorer', {
    state: {
      focusedIndex: 0,
      dirents: [
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
  expect(menuEntries).toContainEqual({
    command: 'Explorer.handleCopy',
    flags: MenuItemFlags.RestoreFocus,
    id: 'copy',
    label: 'Copy',
  })
  expect(menuEntries).not.toContainEqual({
    command: 'Explorer.newFile',
    flags: MenuItemFlags.None,
    id: 'newFile',
    label: 'New File',
  })
})

test('getMenuEntries - focused symlink', async () => {
  ViewletStates.set('Explorer', {
    state: {
      focusedIndex: 0,
      dirents: [
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
  const menuEntries = await MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Explorer.newFile',
    flags: MenuItemFlags.None,
    id: 'newFile',
    label: 'New File',
  })
})
