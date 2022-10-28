test('focusLast - at end', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 2,
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
  expect(await ViewletTitleBarMenuBar.focusLast(state)).toMatchObject({
    focusedIndex: 2,
  })
})
