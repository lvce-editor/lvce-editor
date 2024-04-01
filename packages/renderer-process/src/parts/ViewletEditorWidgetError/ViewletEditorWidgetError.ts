import * as Widget from '../Widget/Widget.js'
import * as SetBounds from '../SetBounds/SetBounds.ts'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet EditorWidgetError EditorOverlayMessage'
  return {
    $Viewlet,
  }
}

export const setMessage = (state, message) => {
  const { $Viewlet } = state
  $Viewlet.textContent = message
  Widget.append($Viewlet)
}

export const setBounds = (state, x, y, width, height) => {
  const { $Viewlet } = state
  SetBounds.setBounds($Viewlet, x, y, width, height)
}
