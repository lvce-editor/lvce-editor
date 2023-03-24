import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const hasFunctionalRender = true

const renderIframeSrc = {
  isEqual(oldState, newState) {
    return oldState.iframeSrc === newState.iframeSrc
  },
  apply(oldState, newState) {
    return ['setIframeSrc', newState.iframeSrc]
  },
}

// TODO this component shouldn't depend on Main
const renderTitle = {
  isEqual(oldState, newState) {
    return oldState.title === newState.title
  },
  apply(oldState, newState) {
    return ['Viewlet.send', ViewletModuleId.Main, 'updateTab', 0, newState.title]
  },
}

const renderButtonsEnabled = {
  isEqual(oldState, newState) {
    return oldState.canGoBack === newState.canGoBack && oldState.canGoForward === newState.canGoForward
  },
  apply(oldState, newState) {
    return [/* method */ 'setButtonsEnabled', /* canGoBack */ newState.canGoBack, /* canGoFoward */ newState.canGoForward]
  },
}

const renderLoading = {
  isEqual(oldState, newState) {
    return oldState.isLoading === newState.isLoading
  },
  apply(oldState, newState) {
    return [/* method */ 'setLoading', /* isLoading */ newState.isLoading]
  },
}

export const render = [renderIframeSrc, renderTitle, renderButtonsEnabled, renderLoading]
