import * as GetTitleBarButtonsVirtualDom from '../GetTitleBarButtonsVirtualDom/GetTitleBarButtonsVirtualDom.js'

export const hasFunctionalRender = true

const renderTitleBarButtons = {
  isEqual(oldState, newState) {
    return oldState.buttons === newState.buttons
  },
  apply(oldState, newState) {
    const dom = GetTitleBarButtonsVirtualDom.getTitleBarButtonsVirtualDom(newState.buttons)
    return ['setDom', dom]
  },
}

export const render = [renderTitleBarButtons]
