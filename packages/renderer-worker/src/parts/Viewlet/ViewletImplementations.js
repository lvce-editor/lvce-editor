import * as ExtensionHostImplementation from '../ExtensionHost/ExtensionHostImplementation.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletLocations from './ViewletLocations.js'

export const name = 'Implementations'

// TODO speed up this function by 130% by not running activation event (onReferences) again and again
// e.g. (21ms activation event, 11ms getReferences) => (11ms getReferences)
const getImplementations = async () => {
  const editor = Viewlet.state.instances.EditorText.state
  const offset = TextDocument.offsetAt(editor, editor.cursor)
  const implementations =
    await ExtensionHostImplementation.executeImplementationProvider(
      editor,
      offset
    )
  console.log({ implementations })
  return implementations
}

export const create = ViewletLocations.create

export const loadContent = async (state) => {
  return ViewletLocations.loadContent(state, getImplementations)
}

export const contentLoaded = (state) => {
  Viewlet.state.instances.Locations = {
    factory: ViewletLocations,
    state,
  }
}

export const dispose = ViewletLocations.dispose

export const hasFunctionalRender = ViewletLocations.hasFunctionalRender

export const render = ViewletLocations.render
