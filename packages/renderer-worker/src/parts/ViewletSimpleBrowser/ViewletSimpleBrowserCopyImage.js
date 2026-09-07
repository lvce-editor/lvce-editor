import * as ElectronWebContentsViewFunctions from '../ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js'

export const copyImage = async (state, x, y) => {
  const { browserViewId } = state
  await ElectronWebContentsViewFunctions.copyImageAt(browserViewId, x, y)
  return state
}
