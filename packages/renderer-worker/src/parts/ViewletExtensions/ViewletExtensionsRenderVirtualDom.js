import * as GetExtensionsVirtualDom from '../GetExtensionsVirtualDom/GetExtensionsVirtualDom.js'
import * as GetVisibleExtensions from '../GetVisibleExtensions/GetVisibleExtensions.js'

export const hasFunctionalRender = true

const renderExtensions = {
  isEqual(oldState, newState) {
    return oldState.items === newState.items && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    // TODO render extensions incrementally when scrolling
    const visibleExtensions = GetVisibleExtensions.getVisible(newState)
    const dom = GetExtensionsVirtualDom.getExtensionsVirtualDom(visibleExtensions)
    return ['setDom', dom]
  },
}

export const render = [renderExtensions]
