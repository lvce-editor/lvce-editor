import * as EditorWorker from '../EditorWorker/EditorWorker.js'
import type { ColorPickerState } from './ViewletColorPickerTypes.ts'

export const create = (uid: number): ColorPickerState => {
  return {
    color: '',
    offsetX: 0,
    min: 0,
    max: 0,
    commands: [],
    uid,
  }
}

export const loadContent = async (state: ColorPickerState) => {
  const newState: ColorPickerState = await EditorWorker.invoke('ColorPicker.loadContent', state)
  const commands = await EditorWorker.invoke('ColorPicker.render', state, newState)
  return {
    ...newState,
    commands,
  }
}

export const handleSliderPointerDown = async (state: ColorPickerState, x: number, y: number) => {
  const newState: ColorPickerState = await EditorWorker.invoke('ColorPicker.handleSliderPointerDown', state, x, y)
  const commands = await EditorWorker.invoke('ColorPicker.render', state, newState)
  return {
    ...newState,
    commands,
  }
}

export const handleSliderPointerMove = async (state: ColorPickerState, x: number, y: number) => {
  const newState: ColorPickerState = await EditorWorker.invoke('ColorPicker.handleSliderPointerMove', state, x, y)
  const commands = await EditorWorker.invoke('ColorPicker.render', state, newState)
  return {
    ...newState,
    commands,
  }
}
