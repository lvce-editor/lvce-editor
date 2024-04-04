import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const load = (id) => {
  switch (id) {
    case MenuEntryId.Edit:
      return import('../MenuEntriesEdit/MenuEntriesEdit.js')
    case MenuEntryId.Editor:
      return import('../MenuEntriesEditor/MenuEntriesEditor.js')
    case MenuEntryId.Explorer:
      return import('../MenuEntriesExplorer/MenuEntriesExplorer.js')
    case MenuEntryId.File:
      return import('../MenuEntriesFile/MenuEntriesFile.js')
    case MenuEntryId.Go:
      return import('../MenuEntriesGo/MenuEntriesGo.js')
    case MenuEntryId.Help:
      return import('../MenuEntriesHelp/MenuEntriesHelp.js')
    case MenuEntryId.OpenRecent:
      return import('../MenuEntriesOpenRecent/MenuEntriesOpenRecent.js')
    case MenuEntryId.Run:
      return import('../MenuEntriesRun/MenuEntriesRun.js')
    case MenuEntryId.Selection:
      return import('../MenuEntriesSelection/MenuEntriesSelection.js')
    case MenuEntryId.Tab:
      return import('../MenuEntriesTab/MenuEntriesTab.js')
    case MenuEntryId.Terminal:
      return import('../MenuEntriesTerminal/MenuEntriesTerminal.js')
    case MenuEntryId.TitleBar:
      return import('../MenuEntriesTitleBar/MenuEntriesTitleBar.js')
    case MenuEntryId.View:
      return import('../MenuEntriesView/MenuEntriesView.js')
    case MenuEntryId.Search:
      return import('../MenuEntriesSearch/MenuEntriesSearch.js')
    case MenuEntryId.EditorImage:
      return import('../MenuEntriesEditorImage/MenuEntriesEditorImage.js')
    case MenuEntryId.SimpleBrowser:
      return import('../MenuEntriesSimpleBrowser/MenuEntriesSimpleBrowser.js')
    case MenuEntryId.Main:
      return import('../MenuEntriesMain/MenuEntriesMain.js')
    default:
      throw new Error(`Module not found "${id}"`)
  }
}
