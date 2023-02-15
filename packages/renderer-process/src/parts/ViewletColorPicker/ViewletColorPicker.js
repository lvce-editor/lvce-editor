import * as ViewletColorPickerEvents from './ViewletColorPickerEvents.js'
import * as SetBounds from '../SetBounds/SetBounds.js'

export const create = () => {
  const $BackgroundColor = document.createElement('div')
  $BackgroundColor.className = 'ColorPickerBackgroundColor'

  const $Light = document.createElement('div')
  $Light.className = 'ColorPickerLight'

  const $Dark = document.createElement('div')
  $Dark.className = 'ColorPickerDark'

  const $ColorPickerRectangle = document.createElement('div')
  $ColorPickerRectangle.className = 'ColorPickerRectangle'
  $ColorPickerRectangle.append($BackgroundColor, $Light, $Dark)

  const $ColorPickerSliderThumb = document.createElement('div')
  $ColorPickerSliderThumb.className = 'ColorPickerSliderThumb'

  const $ColorPickerSlider = document.createElement('div')
  $ColorPickerSlider.className = 'ColorPickerSlider'
  $ColorPickerSlider.append($ColorPickerSliderThumb)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet ColorPicker'
  $Viewlet.append($ColorPickerRectangle, $ColorPickerSlider, $ColorPickerSliderThumb)
  return {
    $Viewlet,
    $BackgroundColor,
    $ColorPickerSlider,
    $ColorPickerSliderThumb,
  }
}

export const attachEvents = (state) => {
  const { $ColorPickerSliderThumb, $ColorPickerSlider } = state
  $ColorPickerSliderThumb.onpointerdown = ViewletColorPickerEvents.handleSliderPointerDown
  $ColorPickerSlider.onpointerdown = ViewletColorPickerEvents.handleSliderPointerDown
}

export const setColor = (state, color) => {
  const { $Viewlet } = state
  $Viewlet.style.setProperty('--ColorPickerColor', color)
}

export const setOffsetX = (state, offsetX) => {
  const { $ColorPickerSliderThumb } = state
  SetBounds.setXAndYTransform($ColorPickerSliderThumb, offsetX, 0)
}
