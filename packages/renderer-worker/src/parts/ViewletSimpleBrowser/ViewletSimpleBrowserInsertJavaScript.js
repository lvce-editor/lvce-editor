import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const insertJavaScript = async (state, css) => {
  const { browserViewId } = state
  const key = await ElectronBrowserViewFunctions.insertJavaScript(browserViewId, css)
  return key
}

// TODO find a better way to mark commands as already wrapped
insertJavaScript.returnValue = true
