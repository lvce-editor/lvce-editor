import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'
import * as ViewletTitleBarMenuBarFocus from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarFocus.js'

test('focus', () => {
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
  expect(ViewletTitleBarMenuBarFocus.focus(state)).toMatchObject({
    focusedIndex: 0,
  })
})
