import * as GetColorPickerVirtualDom from '../GetColorPickerVirtualDom/GetColorPickerVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import type { ColorPickerState } from './ViewletColorPickerTypes.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderColor = {
  isEqual(oldState: ColorPickerState, newState: ColorPickerState) {
    return oldState.color === newState.color
  },
  apply(oldState: ColorPickerState, newState: ColorPickerState) {
    return [/* method */ RenderMethod.SetColor, /* color */ newState.color]
  },
}

const renderOffsetX = {
  isEqual(oldState: ColorPickerState, newState: ColorPickerState) {
    return oldState.offsetX === newState.offsetX
  },
  apply(oldState: ColorPickerState, newState: ColorPickerState) {
    return [/* method */ RenderMethod.SetOffsetX, /* offsetX */ newState.offsetX]
  },
}

const renderColorPicker = {
  isEqual(oldState: ColorPickerState, newState: ColorPickerState) {
    return oldState.min === newState.min && oldState.max === newState.max
  },
  apply(oldState: ColorPickerState, newState: ColorPickerState) {
    const dom = GetColorPickerVirtualDom.getColorPickerVirtualDom()
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderColorPicker, renderColor, renderOffsetX]
