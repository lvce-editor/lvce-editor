import * as References from '../References/References.js'
import * as ViewletLocations from '../ViewletLocations/ViewletLocations.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const getReferences = async () => {
  const editor = ViewletStates.getState(ViewletModuleId.EditorText)
  return References.getReferences(editor)
}

const getFileReferences = async (id, languageId) => {
  return References.getFileReferences(id, languageId)
}

export const create = ViewletLocations.create

// TODO speed up this function by 130% by not running activation event (onReferences) again and again
// e.g. (21ms activation event, 11ms getReferences) => (11ms getReferences)
export const loadContent = async (state) => {
  const editor = ViewletStates.getState(ViewletModuleId.EditorText)
  const fn = state.args
    ? () => {
        // TODO find out language from somewhere else
        return getFileReferences(editor.uid, editor.languageId)
      }
    : getReferences
  return ViewletLocations.loadContent(state, fn)
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
