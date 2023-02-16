import * as SetBounds from '../SetBounds/SetBounds.js'
import * as VisibleSashVerticalEvents from './VisibleSashVerticalEvents.js'

export const create = () => {
  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $Viewlet = document.createElement('div')
  $Viewlet.className = `SashVertical`
  const $SashContent = document.createElement('div')
  $SashContent.className = 'SashVerticalContent'
  $Viewlet.append($SashContent)
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  $Viewlet.onpointerdown = VisibleSashVerticalEvents.handleSashPointerDown
}

export const setPosition = (state, x, y) => {
  const $Viewlet = state
  SetBounds.setXAndY($Viewlet, x, y)
}
