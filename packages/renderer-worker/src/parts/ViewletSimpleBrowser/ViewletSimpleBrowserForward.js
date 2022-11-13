import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const forward = async (state) => {
  const { browserViewId, canGoForward } = state
  if (!canGoForward) {
    return {
      ...state,
      isLoading: false,
    }
  }
  const newCanGoForward = await ElectronBrowserViewFunctions.forward(
    browserViewId
  )
  return {
    ...state,
    isLoading: true,
    canGoBack: true,
    canGoForward: newCanGoForward,
  }
}
