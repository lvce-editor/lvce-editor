import * as GetTitleBarTitleVirtualDom from '../GetTitleBarTitleVirtualDom/GetTitleBarTitleVirtualDom.js'

export const hasFunctionalRender = true

const renderTitle = {
  isEqual(oldState, newState) {
    return oldState.title === newState.title
  },
  apply(oldState, newState) {
    const dom = GetTitleBarTitleVirtualDom.getVirtualDom(newState.title)
    return ['setDom', dom]
  },
}

export const render = [renderTitle]
