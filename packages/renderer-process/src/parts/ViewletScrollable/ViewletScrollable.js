export const setScrollBar = (state, scrollBarY, scrollBarHeight) => {
  const { $ScrollBarThumb } = state
  $ScrollBarThumb.style.top = `${scrollBarY}px`
  $ScrollBarThumb.style.height = `${scrollBarHeight}px`
}
