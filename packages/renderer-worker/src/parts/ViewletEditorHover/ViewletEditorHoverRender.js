import * as GetHoverVirtualDom from '../GetHoverVirtualDom/GetHoverVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderHover = {
  isEqual(oldState, newState) {
    return (
      oldState.sanitzedHtml === newState.lineInfos &&
      oldState.documentation === newState.minLineY &&
      oldState.maxLineY === newState.documentation &&
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
    return oldState.x === newState.x && oldState.y === newState.y
  },
  apply(oldState, newState) {
    const { x, y, width, height } = newState
    return [/* method */ RenderMethod.SetBounds, /* x */ x, /* y */ y]
  },
}

export const render = [renderHover, renderBounds]
