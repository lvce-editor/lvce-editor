import * as MenuEntriesExplorer from '../src/parts/MenuEntries/MenuEntriesExplorer.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

test('getMenuEntries - no focused dirent', async () => {
  ViewletStates.set('Explorer', {
    state: {
      focusedIndex: -1,
      dirents: [],
    },
    factory: {},
  })
  const menuEntries = await MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Explorer.newFile',
    flags: 0,
    id: 'newFile',
    label: 'New File',
  })
  expect(menuEntries).toContainEqual({
    command: 'Explorer.copyPath',
    flags: 0,
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
          type: 'directory',
          path: '/sample-folder',
        },
      ],
    },
    factory: {},
  })
  const menuEntries = await MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Explorer.newFile',
    flags: 0,
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
  const menuEntries = await MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Explorer.handleCopy',
    flags: 0,
    id: 'copy',
    label: 'Copy',
  })
  expect(menuEntries).not.toContainEqual({
    command: 'Explorer.newFile',
    flags: 0,
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
    flags: 0,
    id: 'newFile',
    label: 'New File',
  })
})
