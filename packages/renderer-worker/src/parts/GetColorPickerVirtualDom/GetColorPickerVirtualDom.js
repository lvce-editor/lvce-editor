import { div } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getColorPickerVirtualDom = (color, offset) => {
  return [
    div(
      {
        className: 'Viewlet ColorPicker',
        '--ColorPickerColor': color,
      },
      3
    ),
    div(
      {
        className: 'ColorPickerRectangle',
      },
      3
    ),
    div(
      {
        className: 'ColorPickerBackgroundColor',
      },
      0
    ),
    div(
      {
        className: 'ColorPickerLight',
      },
      0
    ),
    div(
      {
        className: 'ColorPickerDark',
      },
      0
    ),
    div(
      {
        className: 'ColorPickerSlider',
      },
      0
    ),
    div(
      {
        className: 'ColorPickerSliderThumb',
        translateX: offset,
      },
      0
    ),
  ]
}
