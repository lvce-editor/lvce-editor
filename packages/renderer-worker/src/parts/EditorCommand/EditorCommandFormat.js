import * as Editor from '../Editor/Editor.js'
import * as Format from '../Format/Format.js'
import * as EditorShowMessage from './EditorCommandShowMessage.js'

const expectedErrorMessage = `Failed to execute formatting provider: FormattingError:`

const isFormattingError = (error) => {
  return (
    error &&
    error instanceof Error &&
    error.message.startsWith(expectedErrorMessage)
  )
}

// TODO only transfer incremental edits from shared process
// TODO also format with cursor
export const format = async (editor) => {
  try {
    const newContent = await Format.format(editor)
    if (typeof newContent !== 'string') {
      console.warn('something is wrong with format on save', newContent)
      return editor
    }
    const { lines } = editor
    const { length } = lines
    const lineLength = lines[length - 1].length
    const documentEdits = [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: length,
          columnIndex: lineLength,
        },
        type: /* replace */ 3,
        inserted: [newContent],
        deleted: [''],
      },
    ]
    return Editor.scheduleDocumentAndCursorsSelections(editor, documentEdits)
  } catch (error) {
    if (isFormattingError(error)) {
      // @ts-ignore
      console.error(
        `Formatting Error:`,
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
