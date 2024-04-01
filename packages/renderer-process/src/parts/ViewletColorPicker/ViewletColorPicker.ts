import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletColorPickerEvents from './ViewletColorPickerEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet ColorPicker'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  AttachEvents.attachEvents($Viewlet, {
    [DomEventType.PointerDown]: ViewletColorPickerEvents.handlePointerDown,
  })
}

export const setColor = (state, color) => {
  const { $Viewlet } = state
  $Viewlet.style.setProperty('--ColorPickerColor', color)
}

export const setOffsetX = (state, offsetX) => {
  const { $Viewlet } = state
  const $ColorPickerSliderThumb = $Viewlet.querySelector('.ColorPickerSliderThumb')
  SetBounds.setXAndYTransform($ColorPickerSliderThumb, offsetX, 0)
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}
