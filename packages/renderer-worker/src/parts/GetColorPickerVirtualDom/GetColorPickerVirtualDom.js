import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getColorPickerVirtualDom = () => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet ColorPicker',
      onPointerDown: DomEventListenerFunctions.HandlePointerDown,
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ColorPickerRectangle,
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ColorPickerBackgroundColor,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ColorPickerLight,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ColorPickerDark,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ColorPickerSlider,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ColorPickerSliderThumb,
      childCount: 0,
    },
  ]
}
