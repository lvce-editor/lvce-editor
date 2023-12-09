import * as GetStatusBarVirtualDom from '../GetStatusBarVirtualDom/GetStatusBarVirtualDom.js'

export const hasFunctionalRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return oldState.statusBarItemsLeft === newState.statusBarItemsLeft && oldState.statusBarItemsRight === newState.statusBarItemsRight
  },
  apply(oldState, newState) {
    const dom = GetStatusBarVirtualDom.getStatusBarVirtualDom(newState.statusBarItemsLeft, newState.statusBarItemsRight)
    return [/* method */ 'setDom', dom]
  },
}

export const render = [renderItems]
