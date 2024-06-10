import * as CopyLineDown from '../EditorCommand/EditorCommandCopyLineDown.js'
import * as CopyLineUp from '../EditorCommand/EditorCommandCopyLineUp.js'
import * as CursorCharacterLeft from '../EditorCommand/EditorCommandCursorCharacterLeft.js'
import * as CursorCharacterRight from '../EditorCommand/EditorCommandCursorCharacterRight.js'
import * as CursorDown from '../EditorCommand/EditorCommandCursorDown.js'
import * as CursorEnd from '../EditorCommand/EditorCommandCursorEnd.js'
import * as CursorHome from '../EditorCommand/EditorCommandCursorHome.js'
import * as CursorUp from '../EditorCommand/EditorCommandCursorUp.js'
import * as CursorWordLeft from '../EditorCommand/EditorCommandCursorWordLeft.js'
import * as CursorWordPartLeft from '../EditorCommand/EditorCommandCursorWordPartLeft.js'
import * as CursorWordPartRight from '../EditorCommand/EditorCommandCursorWordPartRight.js'
import * as CursorWordRight from '../EditorCommand/EditorCommandCursorWordRight.js'
import * as DeleteAllLeft from '../EditorCommand/EditorCommandDeleteAllLeft.js'
import * as DeleteAllRight from '../EditorCommand/EditorCommandDeleteAllRight.js'
import * as DeleteCharacterLeft from '../EditorCommand/EditorCommandDeleteCharacterLeft.js'
import * as DeleteCharacterRight from '../EditorCommand/EditorCommandDeleteCharacterRight.js'
import * as DeleteHorizontalRight from '../EditorCommand/EditorCommandDeleteHorizontalRight.js'
import * as DeleteWordLeft from '../EditorCommand/EditorCommandDeleteWordLeft.js'
import * as DeleteWordPartLeft from '../EditorCommand/EditorCommandDeleteWordPartLeft.js'
import * as DeleteWordPartRight from '../EditorCommand/EditorCommandDeleteWordPartRight.js'
import * as DeleteWordRight from '../EditorCommand/EditorCommandDeleteWordRight.js'
import * as SelectAll from '../EditorCommand/EditorCommandSelectAll.js'
import * as SelectAllLeft from '../EditorCommand/EditorCommandSelectAllLeft.js'
import * as SelectAllOccurrences from '../EditorCommand/EditorCommandSelectAllOccurrences.js'
import * as SelectAllRight from '../EditorCommand/EditorCommandSelectAllRight.js'
import * as SelectCharacterLeft from '../EditorCommand/EditorCommandSelectCharacterLeft.js'
import * as SelectCharacterRight from '../EditorCommand/EditorCommandSelectCharacterRight.js'
import * as SelectDown from '../EditorCommand/EditorCommandSelectDown.js'
import * as SelectNextOccurrence from '../EditorCommand/EditorCommandSelectNextOccurrence.js'
import * as SelectUp from '../EditorCommand/EditorCommandSelectUp.js'
import * as SelectWordLeft from '../EditorCommand/EditorCommandSelectWordLeft.js'
import * as SelectWordRight from '../EditorCommand/EditorCommandSelectWordRight.js'
import * as MoveLineDown from '../MoveLineDown/MoveLineDown.ts'
import * as MoveLineUp from '../MoveLineUp/MoveLineUp.ts'

export const commandMap = {
  'Editor.copyLineDown': CopyLineDown.copyLineDown,
  'Editor.copyLineUp': CopyLineUp.copyLineUp,
  'Editor.cursorCharacterLeft': CursorCharacterLeft.cursorCharacterLeft,
  'Editor.cursorCharacterRight': CursorCharacterRight.cursorCharacterRight,
  'Editor.cursorDown': CursorDown.cursorDown,
  'Editor.cursorEnd': CursorEnd.cursorEnd,
  'Editor.cursorHome': CursorHome.cursorHome,
  'Editor.cursorLeft': CursorCharacterLeft.cursorCharacterLeft,
  'Editor.cursorRight': CursorCharacterRight.cursorCharacterRight,
  'Editor.cursorUp': CursorUp.cursorUp,
  'Editor.cursorWordLeft': CursorWordLeft.cursorWordLeft,
  'Editor.cursorWordPartLeft': CursorWordPartLeft.cursorWordPartLeft,
  'Editor.cursorWordPartRight': CursorWordPartRight.cursorWordPartRight,
  'Editor.cursorWordRight': CursorWordRight.cursorWordRight,
  'Editor.deleteAllLeft': DeleteAllLeft.deleteAllLeft,
  'Editor.deleteAllRight': DeleteAllRight.deleteAllRight,
  'Editor.deleteCharacterLeft': DeleteCharacterLeft.deleteCharacterLeft,
  'Editor.deleteCharacterRight': DeleteCharacterRight.deleteCharacterRight,
  'Editor.deleteHorizontalRight': DeleteHorizontalRight.editorDeleteHorizontalRight,
  'Editor.deleteWordLeft': DeleteWordLeft.deleteWordLeft,
  'Editor.deleteWordPartLeft': DeleteWordPartLeft.deleteWordPartLeft,
  'Editor.deleteWordPartRight': DeleteWordPartRight.deleteWordPartRight,
  'Editor.deleteWordRight': DeleteWordRight.deleteWordRight,
  'Editor.moveLineDown': MoveLineDown.moveLineDown,
  'Editor.moveLineUp': MoveLineUp.moveLineUp,
  'Editor.selectAll': SelectAll.selectAll,
  'Editor.selectAllLeft': SelectAllLeft.editorSelectAllLeft,
  'Editor.selectAllOccurrences': SelectAllOccurrences.selectAllOccurrences,
  'Editor.selectAllRight': SelectAllRight.editorSelectAllRight,
  'Editor.selectCharacterLeft': SelectCharacterLeft.selectCharacterLeft,
  'Editor.selectCharacterRight': SelectCharacterRight.selectCharacterRight,
  'Editor.selectDown': SelectDown.selectDown,
  'Editor.selectNextOccurrence': SelectNextOccurrence.selectNextOccurrence,
  'Editor.selectUp': SelectUp.selectUp,
  'Editor.selectWordLeft': SelectWordLeft.selectWordLeft,
  'Editor.selectWordRight': SelectWordRight.selectWordRight,
}
