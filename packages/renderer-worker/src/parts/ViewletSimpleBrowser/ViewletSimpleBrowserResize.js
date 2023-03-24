import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}

export const resizeEffect = async (state) => {
  const { headerHeight, browserViewId, x, y, width, height } = state
  await ElectronBrowserViewFunctions.resizeBrowserView(browserViewId, x, y + headerHeight, width, height - headerHeight)
}
