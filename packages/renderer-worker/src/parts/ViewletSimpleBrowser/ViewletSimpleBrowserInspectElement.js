import * as ElectronWebContentsViewFunctions from '../ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js'

export const inspectElement = async (state, x, y) => {
  const { browserViewId } = state
  await ElectronWebContentsViewFunctions.inspectElement(browserViewId, x, y)
  return state
}
