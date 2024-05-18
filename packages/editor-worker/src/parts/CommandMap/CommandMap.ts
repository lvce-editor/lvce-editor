import * as DeleteCharacterLeft from '../EditorCommand/EditorCommandDeleteCharacterLeft.js'
import * as DeleteHorizontalRight from '../EditorCommand/EditorCommandDeleteHorizontalRight.js'
import * as CursorCharacterLeft from '../EditorCommand/EditorCommandCursorCharacterLeft.js'

export const commandMap = {
  'Editor.deleteCharacterLeft': DeleteCharacterLeft.deleteCharacterLeft,
  'Editor.deleteHorizontalRight': DeleteHorizontalRight.editorDeleteHorizontalRight,
  'Editor.cursorCharacterLeft': CursorCharacterLeft.cursorCharacterLeft
}
