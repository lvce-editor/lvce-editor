import * as GetColorPickerVirtualDom from '../GetColorPickerVirtualDom/GetColorPickerVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderColor = {
  isEqual(oldState, newState) {
    return oldState.color === newState.color
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetColor, /* color */ newState.color]
  },
}

const renderOffsetX = {
  isEqual(oldState, newState) {
    return oldState.offsetX === newState.offsetX
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetOffsetX, /* offsetX */ newState.offsetX]
  },
}

const renderColorPicker = {
  isEqual(oldState, newState) {
    return oldState.min === newState.min && oldState.max === newState.max
  },
  apply(oldState, newState) {
    const dom = GetColorPickerVirtualDom.getColorPickerVirtualDom()
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderColorPicker, renderColor, renderOffsetX]
