import * as SetBounds from '../SetBounds/SetBounds.ts'

export const setScrollBar = (state, scrollBarY, scrollBarHeight, scrollBarThumbClass) => {
  const { $ScrollBarThumb } = state
  if (scrollBarThumbClass) {
    $ScrollBarThumb.className = scrollBarThumbClass
  }
  SetBounds.setYAndHeight($ScrollBarThumb, scrollBarY, scrollBarHeight)
}
