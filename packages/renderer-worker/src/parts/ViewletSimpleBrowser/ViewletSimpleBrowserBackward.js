import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const backward = async (state) => {
  const { browserViewId } = state
  await ElectronBrowserViewFunctions.backward(browserViewId)
  const { url, canGoBack, canGoForward } =
    await ElectronBrowserViewFunctions.getStats(browserViewId)
  return {
    ...state,
    isLoading: false,
    canGoBack,
    canGoForward,
    iframeSrc: url,
  }
}
