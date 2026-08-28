import * as ElectronWebContentsViewFunctions from '../ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js'

export const toggleDevTools = async (state) => {
  await ElectronWebContentsViewFunctions.toggleDevTools(state.browserViewId)
  return state
}
