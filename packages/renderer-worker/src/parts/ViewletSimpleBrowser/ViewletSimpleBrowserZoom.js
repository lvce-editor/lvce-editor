import * as ElectronWebContentsViewFunctions from '../ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js'

const updateZoomLevel = (state, zoomLevel) => {
  const tabs = state.tabs.with(state.selectedTabIndex, {
    ...state.tabs[state.selectedTabIndex],
    zoomLevel,
  })
  return { ...state, tabs, zoomLevel }
}

const setZoomLevel = async (state, zoomLevel) => {
  if (zoomLevel === state.zoomLevel) {
    return state
  }
  await ElectronWebContentsViewFunctions.setZoomLevel(state.browserViewId, zoomLevel)
  return updateZoomLevel(state, zoomLevel)
}

export const zoomIn = (state) => {
  return setZoomLevel(state, Math.min(3, state.zoomLevel + 0.5))
}

export const zoomOut = (state) => {
  return setZoomLevel(state, Math.max(-3, state.zoomLevel - 0.5))
}

export const resetZoom = (state) => {
  return setZoomLevel(state, 0)
}
