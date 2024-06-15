import * as Editor from '../Editor/Editor.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as EditorGetWordAt from './EditorCommandGetWordAt.ts'
import * as EditorShowMessage from './EditorCommandShowMessage.ts'

// @ts-ignore
export const goTo = async ({ editor, getLocation, getNoLocationFoundMessage, getErrorMessage, isNoProviderFoundError }) => {
  const { selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  try {
    const definition = await getLocation(editor, rowIndex, columnIndex)
    // TODO if editor is already disposed at this point, do nothing
    if (!definition) {
      // TODO show popup that no definition was found
      // TODO if there was an error, show popup that go to definition resulted in an error
      const info = EditorGetWordAt.getWordAt(editor, rowIndex, columnIndex)
      const message = getNoLocationFoundMessage(info)
      return EditorShowMessage.editorShowMessage(editor, rowIndex, columnIndex, message, false)
    }
    if (typeof definition.uri !== 'string' || typeof definition.startOffset !== 'number' || typeof definition.endOffset !== 'number') {
      // Logger.warn('invalid definition result', definition)
      return editor
    }
    const uri = definition.uri
    if (uri === editor.uri) {
      // TODO set cursor to the definition position
      const position = TextDocument.positionAt(editor, definition.startOffset)
      const selectionEdits = new Uint32Array([position.rowIndex, position.columnIndex, position.rowIndex, position.columnIndex])
      return Editor.scheduleSelections(editor, selectionEdits)
    }
    // TODO if definition.file is not of type string, show a popup that definition.file must be of type string
    // TODO open file and scroll to that position and set cursor to that position

    const context = {
      startRowIndex: definition.startRowIndex,
      startColumnIndex: definition.startColumnIndex,
      endRowIndex: definition.endRowIndex,
      endColumnIndex: definition.endColumnIndex,
    }
    await RendererWorker.invoke(/* Main.openUri */ 'Main.openUri', /* uri */ uri, /* focus */ true, context)
    return editor
  } catch (error) {
    // TODO if editor is already disposed at this point, do nothing
    if (isNoProviderFoundError(error)) {
      const displayErrorMessage = getErrorMessage(error)
      await EditorShowMessage.editorShowMessage(editor, rowIndex, columnIndex, displayErrorMessage, false)
      return editor
    }
    // @ts-ignore
    // ErrorHandling.handleError(error, false)
    const displayErrorMessage = getErrorMessage(error)
    await EditorShowMessage.editorShowMessage(editor, rowIndex, columnIndex, displayErrorMessage, true)
    return editor
  }
}
