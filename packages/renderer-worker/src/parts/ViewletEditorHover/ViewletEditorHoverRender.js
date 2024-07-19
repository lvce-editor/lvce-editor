import * as GetHoverVirtualDom from '../GetHoverVirtualDom/GetHoverVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderHover = {
  isEqual(oldState, newState) {
    return (
      oldState.lineInfos === newState.lineInfos &&
      oldState.documentation === newState.documentation &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.diagnostics === newState.diagnostics
    )
  },
  apply(oldState, newState) {
    const dom = GetHoverVirtualDom.getHoverVirtualDom(newState.lineInfos, newState.documentation, newState.diagnostics)
    return [/* method */ 'Viewlet.setDom2', dom]
  },
}

const renderBounds = {
  isEqual(oldState, newState) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.resizedWidth === newState.resizedWidth
  },
  apply(oldState, newState) {
    // @ts-ignore
    const { x, y, width, height, resizedWidth, uid } = newState
    console.log('apply')
    return [RenderMethod.SetBounds, x, y, resizedWidth, height]
  },
}

export const render = [renderHover, renderBounds]
