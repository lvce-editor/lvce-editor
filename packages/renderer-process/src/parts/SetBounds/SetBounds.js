export const setBounds = ($Element, top, left, width, height) => {
  $Element.style.top = `${top}px`
  $Element.style.left = `${left}px`
  $Element.style.width = `${width}px`
  $Element.style.height = `${height}px`
}

export const setTopAndHeight = ($Element, top, height) => {
  $Element.style.top = `${top}px`
  $Element.style.height = `${height}px`
}

export const setTop = ($Element, top) => {
  $Element.style.top = `${top}px`
}

export const setTopAndLeft = ($Element, top, left) => {
  $Element.style.top = `${top}px`
  $Element.style.left = `${left}px`
}

export const setHeight = ($Element, height) => {
  $Element.style.height = `${height}px`
}
