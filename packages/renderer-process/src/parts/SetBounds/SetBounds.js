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

/**
 *
 * @param {HTMLElement} $Element
 * @param {number} top
 * @param {number} left
 */
export const setTopAndLeftTransform = ($Element, top, left) => {
  $Element.style.translate = `${left}px ${top}px `
}

export const setHeight = ($Element, height) => {
  $Element.style.height = `${height}px`
}
