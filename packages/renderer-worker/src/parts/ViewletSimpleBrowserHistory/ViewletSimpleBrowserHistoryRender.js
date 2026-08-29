import * as GetSimpleBrowserHistoryVirtualDom from '../GetSimpleBrowserHistoryVirtualDom/GetSimpleBrowserHistoryVirtualDom.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderDom = {
  isEqual(oldState, newState) {
    return oldState.loaded === newState.loaded
  },
  apply(oldState, newState) {
    const dom = GetSimpleBrowserHistoryVirtualDom.getSimpleBrowserHistoryVirtualDom(newState.searchValue)
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderDom]
