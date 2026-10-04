import * as ViewletLocations from '../ViewletLocations/ViewletLocations.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as GetActiveEditor from '../GetActiveEditor/GetActiveEditor.js'
import * as Implementation from '../Implementation/Implementation.js'

// TODO speed up this function by 130% by not running activation event (onReferences) again and again
// e.g. (21ms activation event, 11ms getReferences) => (11ms getReferences)
// const getImplementations = () => {
//   const editor = GetActiveEditor.getActiveEditor()
//   return Implementation.getImplementations(editor)
// }

export const create = ViewletLocations.create

export const loadContent = async (state, savedState) => {
  const editor = GetActiveEditor.getActiveEditor()
  const implementations = await Implementation.getImplementations(editor)
  return ViewletLocations.loadContent(state, savedState, 'implementations', implementations)
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
