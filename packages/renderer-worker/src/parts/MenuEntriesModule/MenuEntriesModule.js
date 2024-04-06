import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const load = (id) => {
  switch (id) {
    case MenuEntryId.TitleBar:
      return import('../MenuEntriesTitleBar/MenuEntriesTitleBar.js')
    case MenuEntryId.Editor:
      return import('../MenuEntriesEditor/MenuEntriesEditor.js')
    case MenuEntryId.Tab:
      return import('../MenuEntriesTab/MenuEntriesTab.js')
    case MenuEntryId.Main:
      return import('../MenuEntriesMain/MenuEntriesMain.js')
    default:
      throw new Error(`Module not found "${id}"`)
  }
}
