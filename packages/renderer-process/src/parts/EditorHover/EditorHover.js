import * as Widget from '../Widget/Widget.js'

export const create = (x, y, hover) => {
  const $Hover = document.createElement('div')
  $Hover.id = 'EditorHover'
  $Hover.textContent = hover.label
  $Hover.style.left = `${x}px`
  $Hover.style.top = `${y}px`
  Widget.append($Hover)
  return {
    $Hover,
  }
}

export const update = (state, x, y, hover) => {
  const $Hover = state.$Hover
  $Hover.textContent = hover.label
  $Hover.style.left = `${x}px`
  $Hover.style.top = `${y}px`
}

export const dispose = (state) => {}
