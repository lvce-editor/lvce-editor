import * as ExtensionHostReferences from '../ExtensionHost/ExtensionHostReference.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletLocations from './ViewletLocations.js'

const getReferences = async () => {
  const editor = Viewlet.state.instances.EditorText.state
  const offset = TextDocument.offsetAt(editor, editor.cursor)
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
  Viewlet.state.instances.Locations = {
    factory: ViewletLocations,
    state,
  }
}

export const dispose = ViewletLocations.dispose

export const hasFunctionalRender = ViewletLocations.hasFunctionalRender

export const render = ViewletLocations.render
