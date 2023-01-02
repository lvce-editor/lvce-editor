import * as Widget from '../Widget/Widget.js'
import * as SetBounds from '../SetBounds/SetBounds.js'

export const create = (x, y, hover) => {
  const $Hover = document.createElement('div')
  $Hover.id = 'EditorHover'
  $Hover.textContent = hover.label
  SetBounds.setTopAndLeft($Hover, y, x)
  Widget.append($Hover)
  return {
    $Hover,
  }
}

export const update = (state, x, y, hover) => {
  const $Hover = state.$Hover
  $Hover.textContent = hover.label
  SetBounds.setTopAndLeft($Hover, y, x)
}

export const dispose = (state) => {}
