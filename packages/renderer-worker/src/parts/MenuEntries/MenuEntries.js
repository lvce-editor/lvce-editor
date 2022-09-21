import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

const getModule = (id) => {
  switch (id) {
    case MenuEntryId.ActivityBar:
      return import('./MenuEntriesActivityBar.js')
    case MenuEntryId.Edit:
      return import('./MenuEntriesEdit.js')
    case MenuEntryId.Editor:
      return import('./MenuEntriesEditor.js')
    case MenuEntryId.Explorer:
      return import('./MenuEntriesExplorer.js')
    case MenuEntryId.File:
      return import('./MenuEntriesFile.js')
    case MenuEntryId.Go:
      return import('./MenuEntriesGo.js')
    case MenuEntryId.Help:
      return import('./MenuEntriesHelp.js')
    case MenuEntryId.ManageExtension:
      return import('./MenuEntriesManageExtension.js')
    case MenuEntryId.OpenRecent:
      return import('./MenuEntriesOpenRecent.js')
    case MenuEntryId.Run:
      return import('./MenuEntriesRun.js')
    case MenuEntryId.Selection:
      return import('./MenuEntriesSelection.js')
    case MenuEntryId.Settings:
      return import('./MenuEntriesSettings.js')
    case MenuEntryId.Tab:
      return import('./MenuEntriesTab.js')
    case MenuEntryId.Terminal:
      return import('./MenuEntriesTerminal.js')
    case MenuEntryId.TitleBar:
      return import('./MenuEntriesTitleBar.js')
    case MenuEntryId.View:
      return import('./MenuEntriesView.js')
    case MenuEntryId.ActivityBarAdditionalViews:
      return import('./MenuEntriesActivityBarAdditionalViews.js')
    case MenuEntryId.Search:
      return import('./MenuEntriesSearch.js')
    case MenuEntryId.EditorImage:
      return import('./MenuEntriesEditorImage.js')
    default:
      throw new Error(`module not found "${id}"`)
  }
}

export const getMenuEntries = async (id) => {
  const module = await getModule(id)
  return module.getMenuEntries()
}
