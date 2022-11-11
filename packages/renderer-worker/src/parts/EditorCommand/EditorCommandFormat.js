import * as Editor from '../Editor/Editor.js'
import * as Format from '../Format/Format.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorShowMessage from './EditorCommandShowMessage.js'

const expectedErrorMessage = `Failed to execute formatting provider: FormattingError:`

const isFormattingError = (error) => {
  return (
    error &&
    error instanceof Error &&
    error.message.startsWith(expectedErrorMessage)
  )
}

// TODO also format with cursor
export const format = async (editor) => {
  try {
    const edits = await Format.format(editor)
    if (!Array.isArray(edits)) {
      console.warn('something is wrong with format on save', edits)
      return editor
    }
    if (edits.length === 0) {
      return editor
    }
    const { lines } = editor
    // TODO support multiple edits?
    const edit = edits[0]
    const start = TextDocument.positionAt(editor, edit.startOffset)
    const end = TextDocument.positionAt(editor, edit.endOffset)
    const documentEdits = [
      {
        start,
        end,
        inserted: edit.inserted.split('\n'),
        deleted: lines,
      },
    ]
    return Editor.scheduleDocumentAndCursorsSelections(editor, documentEdits)
  } catch (error) {
    if (isFormattingError(error)) {
      console.error(
        `Formatting Error:`,
        // @ts-ignore
        error.message.slice(expectedErrorMessage.length)
      )
      return editor
    }
    console.error(error)
    const displayErrorMessage = `${error}`
    await EditorShowMessage.editorShowMessage(
      editor,
      0,
      0,
      displayErrorMessage,
      true
    )
    return editor
  }
}
