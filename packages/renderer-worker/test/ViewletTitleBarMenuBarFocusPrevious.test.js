import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'
import * as ViewletTitleBarMenuBarFocusPrevious from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarFocusPrevious.js'

test('focusPrevious', () => {
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
  expect(
    ViewletTitleBarMenuBarFocusPrevious.focusPrevious(state)
  ).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - at start', () => {
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
  expect(
    ViewletTitleBarMenuBarFocusPrevious.focusPrevious(state)
  ).toMatchObject({
    focusedIndex: 2,
  })
})
