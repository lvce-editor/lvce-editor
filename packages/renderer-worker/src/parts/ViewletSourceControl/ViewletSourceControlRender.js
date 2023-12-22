import * as GetSourceControlItemsVirtualDom from '../GetSourceControlItemsVirtualDom/GetSourceControlItemsVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.inputValue === newState.inputValue
  },
  apply(oldState, newState) {
    return [RenderMethod.SetInputValue, /* value */ newState.inputValue]
  },
}

const renderChangedFiles = {
  isEqual(oldState, newState) {
    return oldState.displayItems === newState.displayItems && oldState.buttonIndex === newState.buttonIndex && oldState.buttons === newState.buttons
  },
  apply(oldState, newState) {
    const dom = GetSourceControlItemsVirtualDom.getSourceControlItemsVirtualDom(newState.displayItems, newState.buttonIndex, newState.buttons)
    return [RenderMethod.SetItemsDom, dom]
  },
}

export const render = [renderValue, renderChangedFiles]
