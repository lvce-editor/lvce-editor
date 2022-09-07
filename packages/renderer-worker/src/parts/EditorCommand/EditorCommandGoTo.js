import * as Command from '../Command/Command.js'
import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorShowMessage from './EditorCommandShowMessage.js'

export const goTo = async ({
  editor,
  getLocation,
  getNoLocationFoundMessage,
  getErrorMessage,
  isNoProviderFoundError,
}) => {
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  try {
    const definition = await getLocation(editor, rowIndex, columnIndex)
    // TODO if editor is already disposed at this point, do nothing
    if (!definition) {
      // TODO show popup that no definition was found
      // TODO if there was an error, show popup that go to definition resulted in an error
      const message = getNoLocationFoundMessage()
      return EditorShowMessage.editorShowMessage(
        editor,
        rowIndex,
        columnIndex,
        message,
        false
      )
    }
    if (
      typeof definition.uri !== 'string' ||
      typeof definition.startOffset !== 'number' ||
      typeof definition.endOffset !== 'number'
    ) {
      console.warn('invalid definition result', definition)
      return editor
    }

    if (definition.uri === editor.uri) {
      // TODO set cursor to the definition position
      const position = TextDocument.positionAt(editor, definition.startOffset)
      const selectionEdits = [
        {
          start: position,
          end: position,
        },
      ]
      return Editor.scheduleSelections(editor, selectionEdits)
    }
    // TODO if definition.file is not of type string, show a popup that definition.file must be of type string
    // TODO open file and scroll to that position and set cursor to that position

    await Command.execute(
      /* Main.openUri */ 'Main.openUri',
      /* uri */ definition.file
    )
    return editor
  } catch (error) {
    // TODO if editor is already disposed at this point, do nothing
    if (isNoProviderFoundError(error)) {
      const displayErrorMessage = getErrorMessage(error)
      await EditorShowMessage.editorShowMessage(
        editor,
        rowIndex,
        columnIndex,
        displayErrorMessage,
        false
      )
      return editor
    }
    console.error(error)
    const displayErrorMessage = getErrorMessage(error)
    await EditorShowMessage.editorShowMessage(
      editor,
      rowIndex,
      columnIndex,
      displayErrorMessage,
      true
    )
    return editor
  }
}
