import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const cancelNavigation = async (state) => {
  const { browserViewId } = state
  await ElectronBrowserViewFunctions.cancelNavigation(browserViewId)
  const { url, canGoBack, canGoForward } =
    await ElectronBrowserViewFunctions.getStats(browserViewId)
  return {
    ...state,
    isLoading: false,
    iframeSrc: url,
    canGoBack,
    canGoForward,
  }
}
