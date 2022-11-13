import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const forward = async (state) => {
  const { browserViewId } = state
  await ElectronBrowserViewFunctions.forward(browserViewId)
  return state
}
