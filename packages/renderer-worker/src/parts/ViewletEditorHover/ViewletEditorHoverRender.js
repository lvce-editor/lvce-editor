import * as GetVisibleCompletionItems from '../GetVisibleCompletionItems/GetVisibleCompletionItems.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

export const hasFunctionalRender = true

const renderHover = {
  isEqual(oldState, newState) {
    return (
      oldState.sanitzedHtml === newState.sanitzedHtml && oldState.documentation === newState.minLineY && oldState.maxLineY === newState.documentation
    )
  },
  apply(oldState, newState) {
    return [/* method */ 'setHover', newState.sanitzedHtml, newState.documentation]
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
