export const create = () => {
  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBarSmall'
  $ScrollBar.append($ScrollBarThumb)
  return {
    $ScrollBar,
    $ScrollBarThumb,
  }
}

export const setScrollBar = (state, scrollBarY, scrollBarHeight) => {
  const { $ScrollBarThumb } = state
  $ScrollBarThumb.style.top = `${scrollBarY}px`
  $ScrollBarThumb.style.height = `${scrollBarHeight}px`
}
