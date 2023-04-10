import * as ExtensionHostImplementation from '../ExtensionHost/ExtensionHostImplementation.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

// TODO speed up this function by 130% by not running activation event (onReferences) again and again
// e.g. (21ms activation event, 11ms getReferences) => (11ms getReferences)
export const getImplementations = async (editor) => {
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const implementations = await ExtensionHostImplementation.executeImplementationProvider(editor, offset)
  console.log({ implementations })
  return implementations
}
