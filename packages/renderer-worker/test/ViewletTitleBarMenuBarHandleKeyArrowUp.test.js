test('handleKeyArrowUp - with menu open', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    titleBarEntries: [
      {
        id: MenuEntryId.File,
        name: 'File',
      },
      {
        id: MenuEntryId.Edit,
        name: 'Edit',
      },
      {
        id: MenuEntryId.Selection,
        name: 'Selection',
      },
    ],
    isMenuOpen: true,
    menus: [
      {
        level: 0,
        focusedIndex: 1,
        items: [
          {
            label: '1',
          },
          {
            label: '2',
          },
        ],
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.handleKeyArrowUp(state)).toMatchObject({
    menus: [
      {
        level: 0,
        focusedIndex: 0,
        items: [
          {
            label: '1',
          },
          {
            label: '2',
          },
        ],
      },
    ],
  })
})
