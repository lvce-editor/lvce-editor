import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const cancelNavigation = async (state) => {
  const { browserViewId } = state
  const url = await ElectronBrowserViewFunctions.cancelNavigation(browserViewId)
  return {
    ...state,
    isLoading: false,
    iframeSrc: url,
  }
}
