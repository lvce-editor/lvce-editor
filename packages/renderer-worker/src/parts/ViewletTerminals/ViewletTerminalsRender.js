import * as GetTerminalsDom from '../GetTerminalsDom/GetTerminalsDom.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderDom = {
  isEqual(oldState, newState) {
    return (
      oldState.tabs === newState.tabs &&
      oldState.childUids === newState.childUids &&
      oldState.selectedIndex === newState.selectedIndex &&
      oldState.terminalTabsEnabled === newState.terminalTabsEnabled
    )
  },
  apply(oldState, newState) {
    const dom = GetTerminalsDom.getTerminalsDom(newState)
    return ['Viewlet.setDom2', dom]
  },
}

export const renderFocus = {
  isEqual(oldState, newState) {
    return oldState.focusVersion === newState.focusVersion
  },
  apply(oldState, newState) {
    if (newState.childUid === -1) {
      return []
    }
    return [['Viewlet.focus', newState.childUid]]
  },
  multiple: true,
}

export const render = [renderDom, renderFocus]
