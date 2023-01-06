import * as SetBounds from '../SetBounds/SetBounds.js'

export const setScrollBar = (state, scrollBarY, scrollBarHeight) => {
  const { $ScrollBarThumb } = state
  SetBounds.setYAndHeight($ScrollBarThumb, scrollBarY, scrollBarHeight)
}
