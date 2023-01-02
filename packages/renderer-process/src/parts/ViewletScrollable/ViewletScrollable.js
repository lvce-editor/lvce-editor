import * as SetBounds from '../SetBounds/SetBounds.js'

export const setScrollBar = (state, scrollBarY, scrollBarHeight) => {
  const { $ScrollBarThumb } = state
  SetBounds.setTopAndHeight($ScrollBarThumb, scrollBarY, scrollBarHeight)
}
