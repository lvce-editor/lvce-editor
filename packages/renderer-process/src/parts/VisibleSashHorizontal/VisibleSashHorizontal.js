import * as SetBounds from '../SetBounds/SetBounds.js'
import * as VisibleSashHorizontalEvents from './VisibleSashHorizontalEvents.js'

export const create = () => {
  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $Viewlet = document.createElement('div')
  $Viewlet.className = `SashHorizontal`
  const $SashContent = document.createElement('div')
  $SashContent.className = 'SashHorizontalContent'
  $Viewlet.append($SashContent)
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  $Viewlet.onpointerdown = VisibleSashHorizontalEvents.handleSashPointerDown
}

export const setPosition = (state, x, y) => {
  const $Viewlet = state
  SetBounds.setXAndY($Viewlet, x, y)
}
