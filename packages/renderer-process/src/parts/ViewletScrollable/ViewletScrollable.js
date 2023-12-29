import * as SetBounds from '../SetBounds/SetBounds.js'

export const setScrollBar = (state, scrollBarY, scrollBarHeight) => {
  const { $ScrollBarThumb } = state
  if (!$ScrollBarThumb) {
    return
  }
  SetBounds.setYAndHeight($ScrollBarThumb, scrollBarY, scrollBarHeight)
}
