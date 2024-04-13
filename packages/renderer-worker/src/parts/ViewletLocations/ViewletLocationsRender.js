import * as GetLocationsVirtualDom from '../GetLocationsVirtualDom/GetLocationsVirtualDom.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderLocations = {
  isEqual(oldState, newState) {
    return oldState.displayReferences === newState.displayReferences && oldState.message === newState.message
  },
  apply(oldState, newState) {
    const dom = GetLocationsVirtualDom.getLocationsVirtualDom(newState.displayReferences, newState.message)
    return ['Viewlet.setDom2', dom]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    return [/* method */ 'setFocusedIndex', /* oldFocusedIndex */ oldState.focusedIndex, /* newFocusedIndex */ newState.focusedIndex]
  },
}

export const render = [renderLocations, renderFocusedIndex]
