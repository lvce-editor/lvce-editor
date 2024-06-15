import * as Format from '../Format/Format.ts'
import * as ApplyDocumentEdits from './EditorCommandApplyDocumentEdits.ts'
import * as EditorShowMessage from './EditorCommandShowMessage.ts'

const expectedErrorMessage = 'Failed to execute formatting provider: FormattingError:'

// @ts-ignore
const isFormattingError = (error) => {
  return error && error instanceof Error && error.message.startsWith(expectedErrorMessage)
}

// TODO also format with cursor
export const format = async (editor: any) => {
  try {
    const edits = await Format.format(editor)

    return ApplyDocumentEdits.applyDocumentEdits(editor, edits)
  } catch (error) {
    if (isFormattingError(error)) {
      console.error(
        'Formatting Error:',
        // @ts-ignore
        error.message.slice(expectedErrorMessage.length),
      )
      return editor
    }
    console.error(error)
    const displayErrorMessage = `${error}`
    await EditorShowMessage.editorShowMessage(editor, 0, 0, displayErrorMessage, true)
    return editor
  }
}
