import * as GetSimpleBrowserVirtualDom from '../GetSimpleBrowserVirtualDom/GetSimpleBrowserVirtualDom.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderDom = {
  isEqual(oldState, newState) {
    return (
      oldState.iframeSrc === newState.iframeSrc &&
      oldState.canGoBack === newState.canGoBack &&
      oldState.canGoForward === newState.canGoForward &&
      oldState.isLoading === newState.isLoading
    )
  },
  apply(oldState, newState) {
    const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(
      newState.canGoBack,
      newState.canGoForward,
      newState.isLoading,
      newState.iframeSrc,
    )
    return ['Viewlet.setDom2', dom]
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

export const render = [renderDom, renderTitle]
