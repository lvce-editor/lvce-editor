import * as ViewletColorPicker from './ViewletColorPicker.js'

export const name = 'ColorPicker'

// prettier-ignore
export const Commands = {
  handleSliderPointerDown: ViewletColorPicker.handleSliderPointerDown,
  handleSliderPointerMove: ViewletColorPicker.handleSliderPointerMove,
}

// prettier-ignore
export const LazyCommands = {

}

export * from './ViewletColorPickerCss.js'
export * from './ViewletColorPicker.js'
