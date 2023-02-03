export const setBounds = ($Element, x, y, width, height) => {
  $Element.style.top = `${y}px`
  $Element.style.left = `${x}px`
  $Element.style.width = `${width}px`
  $Element.style.height = `${height}px`
}

export const setYAndHeight = ($Element, y, height) => {
  $Element.style.translate = `0 ${y}px`
  $Element.style.height = `${height}px`
}

export const setTop = ($Element, top) => {
  $Element.style.top = `${top}px`
}

export const setX = ($Element, x) => {
  $Element.style.translate = `${x}px`
}

export const setXAndY = ($Element, x, y) => {
  $Element.style.left = `${x}px`
  $Element.style.top = `${y}px`
}

/**
 *
 * @param {HTMLElement} $Element
 * @param {number} x
 * @param {number} y
 */
export const setXAndYTransform = ($Element, x, y) => {
  $Element.style.translate = `${x}px ${y}px`
}

export const setHeight = ($Element, height) => {
  $Element.style.height = `${height}px`
}
