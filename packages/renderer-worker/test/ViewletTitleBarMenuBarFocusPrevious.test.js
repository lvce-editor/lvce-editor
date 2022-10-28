test('focusPrevious', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 1,
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
  }
  expect(await ViewletTitleBarMenuBar.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - at start', async () => {
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
  }
  expect(await ViewletTitleBarMenuBar.focusPrevious(state)).toMatchObject({
    focusedIndex: 2,
  })
})
