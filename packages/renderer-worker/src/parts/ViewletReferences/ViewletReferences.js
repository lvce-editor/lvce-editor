import * as ViewletLocations from '../ViewletLocations/ViewletLocations.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const create = ViewletLocations.create

export const saveState = ViewletLocations.saveState

// TODO speed up this function by 130% by not running activation event (onReferences) again and again
// e.g. (21ms activation event, 11ms getReferences) => (11ms getReferences)
export const loadContent = async (state, savedState) => {
  // @ts-ignore
  return ViewletLocations.loadContent(state, savedState)
}

// TODO side effect is not good here, find a way to call ViewletLocations
export const contentLoaded = (state) => {
  ViewletStates.set('Locations', {
    factory: ViewletLocations,
    state,
    renderedState: state,
  })
  return []
}

export const dispose = ViewletLocations.dispose

export const renderActions = ViewletLocations.renderActions
