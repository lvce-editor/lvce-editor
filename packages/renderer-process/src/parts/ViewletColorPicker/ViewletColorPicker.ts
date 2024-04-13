import * as SetBounds from '../SetBounds/SetBounds.ts'
export * as Events from './ViewletColorPickerEvents.ts'

export const setColor = (state, color) => {
  const { $Viewlet } = state
  $Viewlet.style.setProperty('--ColorPickerColor', color)
}

export const setOffsetX = (state, offsetX) => {
  const { $Viewlet } = state
  const $ColorPickerSliderThumb = $Viewlet.querySelector('.ColorPickerSliderThumb')
  SetBounds.setXAndYTransform($ColorPickerSliderThumb, offsetX, 0)
}
