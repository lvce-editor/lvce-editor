import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'
import * as ViewletTitleBarMenuBarFocusLast from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarFocusLast.js'

test('focusLast - at end', () => {
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
  expect(ViewletTitleBarMenuBarFocusLast.focusLast(state)).toMatchObject({
    focusedIndex: 2,
  })
})
