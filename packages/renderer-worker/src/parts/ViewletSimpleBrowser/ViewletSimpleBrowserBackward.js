import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const backward = async (state) => {
  const { browserViewId } = state
  await ElectronBrowserViewFunctions.backward(browserViewId)
  return state
}
