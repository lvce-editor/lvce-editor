import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderTabs = {
  isEqual(oldState, newState) {
    return oldState.views === newState.views
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetTabs, /* tabs */ newState.views]
  },
}

const renderSelectedIndex = {
  isEqual(oldState, newState) {
    return oldState.selectedIndex === newState.selectedIndex
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetSelectedIndex, /* unFocusIndex */ oldState.selectedIndex, /* focusIndex */ newState.selectedIndex]
  },
}

export const render = [renderTabs, renderSelectedIndex]
