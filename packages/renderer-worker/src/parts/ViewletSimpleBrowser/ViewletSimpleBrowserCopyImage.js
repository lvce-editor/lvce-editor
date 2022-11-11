import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const copyImage = async (state, x, y) => {
  const { browserViewId } = state
  await ElectronBrowserViewFunctions.copyImageAt(browserViewId, x, y)
  return state
}
