import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuEntriesTab from '../MenuEntriesTab/MenuEntriesTab.js'
import * as MenuEntriesMain from '../MenuEntriesMain/MenuEntriesMain.js'

export const getQuickPickMenuEntries = () => {
  return [
    {
      id: 'Main.splitRight',
      label: 'Main: Split Right',
    },
    {
      id: 'Main.splitLeft',
      label: 'Main: Split Left',
    },
    {
      id: 'Main.splitDown',
      label: 'Main: Split Down',
    },
    {
      id: 'Main.splitUp',
      label: 'Main: Split Up',
    },
    {
      id: 'Main.reopenEditorWith',
      label: 'Main: Reopen Editor With',
    },
  ]
}

export const menus = []

export const getMenus = async () => {
  const ids = [MenuEntryId.Main, MenuEntryId.Tab]
  const adjusted = ids.map((id) => {
    return {
      id,
      async getMenuEntries(...args) {
        switch (id) {
          case MenuEntryId.Tab:
            return MenuEntriesTab.getMenuEntries()
          case MenuEntryId.Main:
            return MenuEntriesMain.getMenuEntries()
          default:
            return []
        }
      },
    }
  })
  return adjusted
}
