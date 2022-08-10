import * as Assert from '../Assert/Assert.js'

const getModule = (id) => {
  Assert.string(id)
  switch (id) {
    case 'activityBar':
      return import('./MenuEntriesActivityBar.js')
    case 'edit':
      return import('./MenuEntriesEdit.js')
    case 'editor':
      return import('./MenuEntriesEditor.js')
    case 'explorer':
      return import('./MenuEntriesExplorer.js')
    case 'file':
      return import('./MenuEntriesFile.js')
    case 'go':
      return import('./MenuEntriesGo.js')
    case 'help':
      return import('./MenuEntriesHelp.js')
    case 'manageExtension':
      return import('./MenuEntriesManageExtension.js')
    case 'openRecent':
      return import('./MenuEntriesOpenRecent.js')
    case 'run':
      return import('./MenuEntriesRun.js')
    case 'selection':
      return import('./MenuEntriesSelection.js')
    case 'settings':
      return import('./MenuEntriesSettings.js')
    case 'tab':
      return import('./MenuEntriesTab.js')
    case 'terminal':
      return import('./MenuEntriesTerminal.js')
    case 'titleBar':
      return import('./MenuEntriesTitleBar.js')
    case 'view':
      return import('./MenuEntriesView.js')
    case 'activity-bar-additional-views':
      return import('./MenuEntriesActivityBarAdditionalViews.js')
    default:
      throw new Error(`module not found "${id}"`)
  }
}

export const getMenuEntries = async (id) => {
  const module = await getModule(id)
  return module.getMenuEntries()
}
