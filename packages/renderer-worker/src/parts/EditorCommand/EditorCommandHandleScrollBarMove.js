import * as Editor from '../Editor/Editor.js'

const getNewPercent = (state, relativeY) => {
  const { height, scrollBarHeight } = state
  // if (relativeY <= editor.scrollBarHeight / 2) {
  //   console.log('clicked at top')
  //   // clicked at top
  //   return 0
  // }
  if (relativeY <= height - scrollBarHeight / 2) {
    // clicked in middle
    return relativeY / (height - scrollBarHeight)
  }
  // clicked at bottom
  return 1
}

export const handleScrollBarMove = (state, eventY) => {
  const { y, finalDeltaY, handleOffset } = state
  const relativeY = eventY - y - handleOffset
  const newPercent = getNewPercent(state, relativeY)
  const newDeltaY = newPercent * finalDeltaY
  return Editor.setDeltaYFixedValue(state, newDeltaY)
}

export const handleScrollBarVerticalPointerMove = handleScrollBarMove
