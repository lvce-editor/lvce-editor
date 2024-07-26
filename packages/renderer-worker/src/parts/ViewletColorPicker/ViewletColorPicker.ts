import * as EditorWorker from '../EditorWorker/EditorWorker.js'
import type { ColorPickerState } from './ViewletColorPickerTypes.ts'

export const create = (): ColorPickerState => {
  return {
    color: '',
    offsetX: 0,
    min: 0,
    max: 0,
  }
}

export const loadContent = (state: ColorPickerState) => {
  return EditorWorker.invoke('ColorPicker.loadContent', state)
}

export const handleSliderPointerDown = (state: ColorPickerState, x: number, y: number) => {
  return EditorWorker.invoke('ColorPicker.handleSliderPointerDown', state, x, y)
}

export const handleSliderPointerMove = (state: ColorPickerState, x: number, y: number) => {
  return EditorWorker.invoke('ColorPicker.handleSliderPointerMove', state, x, y)
}
