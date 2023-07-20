import * as References from '../References/References.js'
import * as ViewletLocations from '../ViewletLocations/ViewletLocations.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const getReferences = async () => {
  const editor = ViewletStates.getState(ViewletModuleId.EditorText)
  return References.getReferences(editor)
}

// TODO speed up this function by 130% by not running activation event (onReferences) again and again
// e.g. (21ms activation event, 11ms getReferences) => (11ms getReferences)

// TODO pass editor id as uri, allow multiple references views
export const loadContent = async (state) => {
  return ViewletLocations.loadContentInternal(state, getReferences)
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
