import * as SimpleBrowserPreview from '../SimpleBrowserPreview/SimpleBrowserPreview.js'
import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const reload = async (state) => {
  const tab = state.tabs?.[state.selectedTabIndex]
  if (tab?.previewUid) {
    await SimpleBrowserPreview.reload(tab)
    return state
  }
  const { browserViewId } = state
  if (!browserViewId) {
    return state
  }
  await ElectronBrowserViewFunctions.reload(browserViewId)
  return {
    ...state,
    isLoading: true,
  }
}
