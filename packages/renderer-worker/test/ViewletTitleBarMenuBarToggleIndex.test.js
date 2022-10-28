test('toggleIndex - when open - when same index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
    titleBarEntries: [
      {
        id: MenuEntryId.File,
        name: 'File',
      },
      {
        id: MenuEntryId.Edit,
        name: 'Edit',
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.toggleIndex(state, 0)).toMatchObject({
    focusedIndex: 0,
    isMenuOpen: false,
  })
})

test('toggleIndex - when open - when different index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
    titleBarEntries: [
      {
        id: MenuEntryId.File,
        name: 'File',
      },
      {
        id: MenuEntryId.Edit,
        name: 'Edit',
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.toggleIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
    menus: [
      {
        level: 0,
        items: [
          {
            flags: MenuItemFlags.Disabled,
            id: 'undo',
            label: 'Undo',
          },
          {
            flags: MenuItemFlags.Disabled,
            id: 'redo',
            label: 'Redo',
          },
        ],
      },
    ],
  })
})

test('toggleIndex - when closed - when same index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: false,
    titleBarEntries: [
      {
        id: MenuEntryId.File,
        name: 'File',
      },
      {
        id: MenuEntryId.Edit,
        name: 'Edit',
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.toggleIndex(state, 0)).toMatchObject({
    focusedIndex: 0,
    isMenuOpen: true,
    menus: [
      {
        level: 0,
        items: [
          {
            flags: MenuItemFlags.Disabled,
            id: 'newFile',
            label: 'New File',
          },
          {
            flags: MenuItemFlags.Disabled,
            id: 'newWindow',
            label: 'New Window',
          },
          {
            flags: MenuItemFlags.SubMenu,
            id: MenuEntryId.OpenRecent,
            label: 'Open Recent',
          },
        ],
      },
    ],
  })
})

test('toggleIndex - when closed - when different index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: false,
    titleBarEntries: [
      {
        id: MenuEntryId.File,
        name: 'File',
      },
      {
        id: MenuEntryId.Edit,
        name: 'Edit',
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.toggleIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
    menus: [
      {
        level: 0,
        items: [
          {
            flags: MenuItemFlags.Disabled,
            id: 'undo',
            label: 'Undo',
          },
          {
            flags: MenuItemFlags.Disabled,
            id: 'redo',
            label: 'Redo',
          },
        ],
      },
    ],
  })
})
