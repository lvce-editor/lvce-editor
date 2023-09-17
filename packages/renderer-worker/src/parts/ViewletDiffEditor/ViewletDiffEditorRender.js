import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

export const hasFunctionalRender = true

const getVisible = (lines, minLineY, maxLineY) => {
  return lines.slice(minLineY, maxLineY)
}

const renderLeft = {
  isEqual(oldState, newState) {
    return oldState.linesLeft === newState.linesLeft && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    const visible = getVisible(newState.linesLeft, newState.minLineY, newState.maxLineY)
    return [/* method */ RenderMethod.SetContentLeft, /* linesLeft */ visible]
  },
}

const renderRight = {
  isEqual(oldState, newState) {
    return oldState.linesRight === newState.linesRight && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    const visible = getVisible(newState.linesRight, newState.minLineY, newState.maxLineY)
    return [/* method */ RenderMethod.SetContentRight, /* linesRight */ visible]
  },
}

const renderChanges = {
  isEqual(oldState, newState) {
    return oldState.changes === newState.changes
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetChanges, /* changes */ newState.changes]
  },
}

const renderScrollBar = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY && oldState.height === newState.height && oldState.finalDeltaY === newState.finalDeltaY
  },
  apply(oldState, newState) {
    const scrollBarY = ScrollBarFunctions.getScrollBarY(
      newState.deltaY,
      newState.finalDeltaY,
      newState.height - newState.headerHeight,
      newState.scrollBarHeight
    )
    return [/* method */ RenderMethod.SetScrollBar, /* scrollBarY */ scrollBarY, /* scrollBarHeight */ newState.scrollBarHeight]
  },
}

export const render = [renderLeft, renderRight, renderChanges, renderScrollBar]
