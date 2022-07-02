import * as MenuEntriesExplorer from '../src/parts/MenuEntries/MenuEntriesExplorer.js'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'

test('getMenuEntries - no focused dirent', async () => {
  Viewlet.state.instances = {
    Explorer: {
      state: {
        focusedIndex: -1,
        dirents: [],
      },
    },
  }
  const menuEntries = await MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Explorer.newFile',
    flags: 0,
    id: 'newFile',
    label: 'New File',
  })
})

test('getMenuEntries - focused folder', async () => {
  Viewlet.state.instances = {
    Explorer: {
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
    },
  }
  const menuEntries = await MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Explorer.newFile',
    flags: 0,
    id: 'newFile',
    label: 'New File',
  })
})

test('getMenuEntries - focused file', async () => {
  Viewlet.state.instances = {
    Explorer: {
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
    },
  }
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
  Viewlet.state.instances = {
    Explorer: {
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
    },
  }
  const menuEntries = await MenuEntriesExplorer.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Explorer.newFile',
    flags: 0,
    id: 'newFile',
    label: 'New File',
  })
})
