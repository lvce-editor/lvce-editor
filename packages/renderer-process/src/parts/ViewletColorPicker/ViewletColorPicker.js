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
  $ColorPickerSlider.onpointerdown = ViewletColorPickerEvents.handleSliderPointerDown

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet ColorPicker'
  $Viewlet.append($ColorPickerRectangle, $ColorPickerSlider)
  return {
    $Viewlet,
    $BackgroundColor,
    $ColorPickerSliderThumb,
  }
}

export const setColor = (state, color) => {
  const { $BackgroundColor, $ColorPickerSliderThumb } = state
  $BackgroundColor.style.background = color
  $ColorPickerSliderThumb.style.background = color
}

export const setOffsetX = (state, offsetX) => {
  const { $ColorPickerSliderThumb } = state
  SetBounds.setXAndYTransform($ColorPickerSliderThumb, offsetX, 0)
}
