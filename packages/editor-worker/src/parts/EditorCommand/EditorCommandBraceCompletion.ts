// import * as EditorCompletion from '../EditorCompletion/EditorCompletion.ts'
// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
// @ts-ignore
import * as ExtensionHostBraceCompletion from '../ExtensionHost/ExtensionHostBraceCompletion.ts'
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.ts'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.ts'
import * as EditorShowMessage from './EditorCommandShowMessage.ts'

// @ts-ignore
const getErrorMessage = (error) => {
  return `${error}`
}

// @ts-ignore
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

// @ts-ignore
export const braceCompletion = async (editor, text) => {
  try {
    // @ts-ignore
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
    // @ts-ignore
    return EditorShowMessage.showErrorMessage(editor, position, getErrorMessage(error))
  }
}
