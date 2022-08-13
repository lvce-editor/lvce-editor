export const setDimensions = ($Element, top, left, width, height) => {
  $Element.style.top = `${top}px`
  $Element.style.left = `${left}px`
  $Element.style.width = `${width}px`
  $Element.style.height = `${height}px`
}
