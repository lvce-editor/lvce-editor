import * as ExtensionHostReferences from '../ExtensionHost/ExtensionHostReference.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as ViewletLocations from '../ViewletLocations/ViewletLocations.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const getReferences = async () => {
  const editor = ViewletStates.getState('EditorText')
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const references = await ExtensionHostReferences.executeReferenceProvider(
    editor,
    offset
  )
  return references
}

export const name = 'References'

export const create = ViewletLocations.create

// TODO speed up this function by 130% by not running activation event (onReferences) again and again
// e.g. (21ms activation event, 11ms getReferences) => (11ms getReferences)
export const loadContent = async (state) => {
  return ViewletLocations.loadContent(state, getReferences)
}

// TODO side effect is not good here, find a way to call ViewletLocations
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
