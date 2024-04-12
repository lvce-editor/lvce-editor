import * as GetSourceControlVirtualDom from '../GetSourceControlVirtualDom/GetSourceControlVirtualDom.js'
import * as GetVisibleSourceControlItems from '../GetVisibleSourceControlItems/GetVisibleSourceControlItems.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

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
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.deltaY === newState.deltaY &&
      oldState.buttonIndex === newState.buttonIndex &&
      oldState.buttons === newState.buttons
    )
  },
  apply(oldState, newState) {
    const visible = GetVisibleSourceControlItems.getVisibleSourceControlItems(
      newState.items,
      newState.minLineY,
      newState.maxLineY,
      newState.buttons,
      newState.buttonIndex,
    )
    const dom = GetSourceControlVirtualDom.getSourceControlVirtualDom(visible, newState.splitButtonEnabled)
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderValue, renderChangedFiles]
