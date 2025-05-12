import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const getDomTree = async (state) => {
  const { browserViewId } = state
  const domTree = await ElectronBrowserViewFunctions.getDomTree(browserViewId)
  return {
    ...state,
    domTree,
  }
}
