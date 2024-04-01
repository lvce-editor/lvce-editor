export const setBounds = ($Element, x, y, width, height) => {
  $Element.style.top = `${y}px`
  $Element.style.left = `${x}px`
  $Element.style.width = `${width}px`
  $Element.style.height = `${height}px`
}

export const setBoundsPixelString = ($Element, x, y, width, height) => {
  $Element.style.top = y
  $Element.style.left = x
  $Element.style.width = width
  $Element.style.height = height
}

export const setX = ($Element, x) => {
  $Element.style.translate = `${x}px 0`
}

export const setYAndHeight = ($Element, y, height) => {
  if (!$Element) {
    return
  }
  if (typeof y === 'string') {
    $Element.style.translate = y
  } else {
    $Element.style.translate = `0 ${y}px`
  }
  if (typeof height === 'string') {
    $Element.style.height = height
  } else {
    $Element.style.height = `${height}px`
  }
}

export const setXAndWidth = ($Element, x, width) => {
  $Element.style.translate = `${x}px 0`
  $Element.style.width = `${width}px`
}

export const setWidth = ($Element, width) => {
  $Element.style.width = `${width}px`
}

export const setTop = ($Element, top) => {
  $Element.style.top = `${top}px`
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
