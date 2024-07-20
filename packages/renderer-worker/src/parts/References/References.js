import * as ExtensionHostReferences from '../ExtensionHost/ExtensionHostReference.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

export const getReferences = async (editor) => {
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const offset = await TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const references = await ExtensionHostReferences.executeReferenceProvider(editor, offset)
  return references
}

export const getFileReferences = async (id, languageId) => {
  const references = await ExtensionHostReferences.executeFileReferenceProvider(id, languageId)
  return references
}
