import * as CursorCharacterLeft from '../EditorCommand/EditorCommandCursorCharacterLeft.js'
import * as CursorCharacterRight from '../EditorCommand/EditorCommandCursorCharacterRight.js'
import * as CursorWordLeft from '../EditorCommand/EditorCommandCursorWordLeft.js'
import * as CursorWordPartLeft from '../EditorCommand/EditorCommandCursorWordPartLeft.js'
import * as DeleteCharacterLeft from '../EditorCommand/EditorCommandDeleteCharacterLeft.js'
import * as DeleteHorizontalRight from '../EditorCommand/EditorCommandDeleteHorizontalRight.js'
import * as DeleteWordLeft from '../EditorCommand/EditorCommandDeleteWordLeft.js'
import * as DeleteWordPartLeft from '../EditorCommand/EditorCommandDeleteWordPartLeft.js'

export const commandMap = {
  'Editor.cursorCharacterLeft': CursorCharacterLeft.cursorCharacterLeft,
  'Editor.cursorCharacterRight': CursorCharacterRight.cursorCharacterRight,
  'Editor.cursorWordLeft': CursorWordLeft.cursorWordLeft,
  'Editor.cursorWordPartLeft': CursorWordPartLeft.cursorWordPartLeft,
  'Editor.deleteCharacterLeft': DeleteCharacterLeft.deleteCharacterLeft,
  'Editor.deleteHorizontalRight': DeleteHorizontalRight.editorDeleteHorizontalRight,
  'Editor.deleteWordLeft': DeleteWordLeft.deleteWordLeft,
  'Editor.deleteWordPartLeft': DeleteWordPartLeft.deleteWordPartLeft,
}
