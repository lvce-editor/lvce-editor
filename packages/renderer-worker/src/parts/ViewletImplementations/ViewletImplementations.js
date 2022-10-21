import * as ExtensionHostImplementation from '../ExtensionHost/ExtensionHostImplementation.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as ViewletLocations from '../ViewletLocations/ViewletLocations.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const name = ViewletModuleId.Implementations

// TODO speed up this function by 130% by not running activation event (onReferences) again and again
// e.g. (21ms activation event, 11ms getReferences) => (11ms getReferences)
const getImplementations = async () => {
  const editor = ViewletStates.getState('EditorText')
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
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
  ViewletStates.set('Locations', {
    factory: ViewletLocations,
    state,
  })
  return []
}

export const dispose = ViewletLocations.dispose

export const hasFunctionalRender = ViewletLocations.hasFunctionalRender

export const render = ViewletLocations.render
