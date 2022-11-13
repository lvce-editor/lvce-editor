import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const reload = async (state) => {
  const { browserViewId } = state
  await ElectronBrowserViewFunctions.reload(browserViewId)
  return state
}
