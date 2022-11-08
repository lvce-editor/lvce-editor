import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const inspectElement = async (state, x, y) => {
  const { browserViewId } = state
  await ElectronBrowserViewFunctions.inspectElement(browserViewId, x, y)
  return state
}
