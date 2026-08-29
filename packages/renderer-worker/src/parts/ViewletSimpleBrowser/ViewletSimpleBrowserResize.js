import * as ElectronWebContentsViewFunctions from '../ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js'

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}

export const resizeEffect = async (state) => {
  const { headerHeight, tabs, x, y, width, height } = state
  await Promise.all(
    tabs
      .filter((tab) => tab.browserViewId)
      .map((tab) => ElectronWebContentsViewFunctions.resizeWebContentsView(tab.browserViewId, x, y + headerHeight, width, height - headerHeight)),
  )
}
