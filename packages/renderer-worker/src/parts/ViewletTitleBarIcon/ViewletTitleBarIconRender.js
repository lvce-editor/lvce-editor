import * as GetTitleBarIconVirtualDom from '../GetTitleBarIconVirtualDom/GetTitleBarIconVirtualDom.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderIcon = {
  isEqual(oldState, newState) {
    return oldState.iconSrc === newState.iconSrc
  },
  apply(oldState, newState) {
    const dom = GetTitleBarIconVirtualDom.getTitleBarIconVirtualDom(newState.iconSrc)
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderIcon]
