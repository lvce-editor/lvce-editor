import * as Implementation from '../Implementation/Implementation.js'
import * as ViewletLocations from '../ViewletLocations/ViewletLocations.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

// TODO speed up this function by 130% by not running activation event (onReferences) again and again
// e.g. (21ms activation event, 11ms getReferences) => (11ms getReferences)
const getImplementations = () => {
  const editor = ViewletStates.getState(ViewletModuleId.EditorText)
  return Implementation.getImplementations(editor)
}

export const create = ViewletLocations.create

export const loadContent = async (state) => {
  return ViewletLocations.loadContent(state, getImplementations)
}

export const contentLoaded = (state) => {
  ViewletStates.set('Locations', {
    factory: ViewletLocations,
    state,
  })
  return []
}

export const dispose = ViewletLocations.dispose

export const hasFunctionalRender = ViewletLocations.hasFunctionalRender

export const render = ViewletLocations.render
