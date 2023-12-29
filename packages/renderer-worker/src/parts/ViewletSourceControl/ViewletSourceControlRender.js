import * as GetSourceControlItemsVirtualDom from '../GetSourceControlItemsVirtualDom/GetSourceControlItemsVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as GetVisibleSourceControlItems from '../GetVisibleSourceControlItems/GetVisibleSourceControlItems.js'

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
    const minLineY = 0
    const maxLineY = Math.min(newState.displayItems.length, 100)
    const visible = GetVisibleSourceControlItems.getVisibleSourceControlItems(
      newState.displayItems,
      minLineY,
      maxLineY,
      newState.buttons,
      newState.buttonIndex,
    )
    const dom = GetSourceControlItemsVirtualDom.getSourceControlItemsVirtualDom(visible, newState.splitButtonEnabled)
    return [RenderMethod.SetDom, dom]
  },
}

export const render = [renderValue, renderChangedFiles]
