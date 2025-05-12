import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const insertCss = async (state, css) => {
  const { browserViewId } = state
  const key = await ElectronBrowserViewFunctions.insertCss(browserViewId, css)
  return key
}

// TODO find a better way to mark commands as already wrapped
insertCss.returnValue = true
