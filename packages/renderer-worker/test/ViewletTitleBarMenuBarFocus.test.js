test('focus', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 42,
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
  expect(await ViewletTitleBarMenuBar.focus(state)).toMatchObject({
    focusedIndex: 0,
  })
})
