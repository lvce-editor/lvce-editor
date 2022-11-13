import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'


export const openDevtools = async (state) => {
  const { browserViewId } = state
  await ElectronBrowserViewFunctions.openDevtools(browserViewId)
  return state
}
