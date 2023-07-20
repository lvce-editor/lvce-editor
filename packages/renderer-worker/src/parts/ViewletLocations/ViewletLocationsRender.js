import * as GetLocationsVirtualDom from '../GetLocationsVirtualDom/GetLocationsVirtualDom.js'

export const hasFunctionalRender = true

const renderLocations = {
  isEqual(oldState, newState) {
    return oldState.displayReferences === newState.displayReferences
  },
  apply(oldState, newState) {
    const dom = GetLocationsVirtualDom.getVirtualDom(newState.displayReferences, newState.message)
    return [/* Viewlet.invoke */ 'Viewlet.send', /* id */ newState.id, /* method */ 'setDom', dom]
  },
}

export const render = [renderLocations]
