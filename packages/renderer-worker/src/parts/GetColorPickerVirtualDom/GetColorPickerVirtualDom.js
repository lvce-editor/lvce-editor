import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getColorPickerVirtualDom = (color, offset) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet ColorPicker',
      '--ColorPickerColor': color,
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ColorPickerRectangle',
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ColorPickerBackgroundColor',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ColorPickerLight',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ColorPickerDark',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ColorPickerSlider',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ColorPickerSliderThumb',
      translateX: offset,
      childCount: 0,
    },
  ]
}
