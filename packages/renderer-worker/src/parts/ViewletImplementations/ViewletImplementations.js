import * as ViewletLocations from '../ViewletLocations/ViewletLocations.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

// TODO speed up this function by 130% by not running activation event (onReferences) again and again
// e.g. (21ms activation event, 11ms getReferences) => (11ms getReferences)
// const getImplementations = () => {
//   const editor = GetActiveEditor.getActiveEditor()
//   return Implementation.getImplementations(editor)
// }

export const create = ViewletLocations.create

export const loadContent = async (state, savedState) => {
  return ViewletLocations.loadContent(state, savedState, 'implementations')
}

export const contentLoaded = (state) => {
  ViewletStates.set('Locations', {
    factory: ViewletLocations,
    state,
    renderedState: state,
  })
  return []
}

export const dispose = ViewletLocations.dispose
