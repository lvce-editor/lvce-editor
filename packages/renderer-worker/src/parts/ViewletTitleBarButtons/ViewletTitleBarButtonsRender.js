import * as GetTitleBarButtonsVirtualDom from '../GetTitleBarButtonsVirtualDom/GetTitleBarButtonsVirtualDom.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderTitleBarButtons = {
  isEqual(oldState, newState) {
    return oldState.buttons === newState.buttons
  },
  apply(oldState, newState) {
    const dom = GetTitleBarButtonsVirtualDom.getTitleBarButtonsVirtualDom(newState.buttons)
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderTitleBarButtons]
