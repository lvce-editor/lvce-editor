import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const cancelNavigation = async (state) => {
  const { browserViewId } = state
  await ElectronBrowserViewFunctions.cancelNavigation(browserViewId)
  return state
}
