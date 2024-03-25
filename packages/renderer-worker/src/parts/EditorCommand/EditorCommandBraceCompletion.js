// import * as EditorCompletion from '../EditorCompletion/EditorCompletion.js'
import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as ExtensionHostBraceCompletion from '../ExtensionHost/ExtensionHostBraceCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'
import * as EditorShowMessage from './EditorCommandShowMessage.js'

const getErrorMessage = (error) => {
  return `${error}`
}

const getMatchingClosingBrace = (brace) => {
  switch (brace) {
    case '{':
      return '}'
    case '(':
      return ')'
    case '[':
      return ']'
    default:
      return '???'
  }
}

export const braceCompletion = async (editor, text) => {
  try {
    const offset = TextDocument.offsetAt(editor, editor.cursor)
    const result = await ExtensionHostBraceCompletion.executeBraceCompletionProvider(editor, offset, text)
    if (result) {
      const closingBrace = getMatchingClosingBrace(text)
      const insertText = text + closingBrace
      const changes = editorReplaceSelections(editor, [insertText], EditOrigin.EditorType)
      return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
    }
    const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  } catch (error) {
    console.error(error)
    // TODO cursor should always be of type object
    const position = Array.isArray(editor.cursor) ? editor.cursor[0] : editor.cursor
    return EditorShowMessage.showErrorMessage(editor, position, getErrorMessage(error))
  }
}
