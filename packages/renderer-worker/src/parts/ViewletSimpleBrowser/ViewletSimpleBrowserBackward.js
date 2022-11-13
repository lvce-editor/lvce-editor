import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const backward = async (state) => {
  const { browserViewId, canGoBack, isLoading } = state
  console.log({ isLoading })
  if (isLoading) {
  }
  if (!canGoBack) {
    return {
      ...state,
      isLoading: false,
    }
  }
  const newCanGoBack = await ElectronBrowserViewFunctions.backward(
    browserViewId
  )
  return {
    ...state,
    isLoading: false,
    canGoBack: newCanGoBack,
    canGoForward: true,
  }
}
