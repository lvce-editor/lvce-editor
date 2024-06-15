import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
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

export const braceCompletion = async (editor: any, text: string) => {
  try {
    // @ts-ignore
    const offset = TextDocument.offsetAt(editor, editor.cursor)
    const result = await RendererWorker.invoke('ExtensionHostBraceCompletion.executeBraceCompletionProvider', editor, offset, text)
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
