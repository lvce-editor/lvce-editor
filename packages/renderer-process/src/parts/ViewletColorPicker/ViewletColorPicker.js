import * as ViewletColorPickerEvents from './ViewletColorPickerEvents.js'

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
  }
}

export const setColor = (state, color) => {
  const { $BackgroundColor } = state
  $BackgroundColor.style.background = color
}
