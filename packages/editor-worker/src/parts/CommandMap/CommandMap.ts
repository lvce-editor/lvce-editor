import * as AddCursorAbove from '../EditorCommand/EditorCommandAddCursorAbove.ts'
import * as AddCursorBelow from '../EditorCommand/EditorCommandAddCursorBelow.ts'
import * as EditorApplyEdit from '../EditorCommand/EditorCommandApplyEdit.ts'
import * as EditorBraceCompletion from '../EditorCommand/EditorCommandBraceCompletion.ts'
import * as CancelSelection from '../EditorCommand/EditorCommandCancelSelection.ts'
import * as EditorCloseCompletion from '../EditorCommand/EditorCommandCloseCompletion.ts'
import * as Composition from '../EditorCommand/EditorCommandComposition.ts'
import * as Copy from '../EditorCommand/EditorCommandCopy.ts'
import * as CopyLineDown from '../EditorCommand/EditorCommandCopyLineDown.ts'
import * as CopyLineUp from '../EditorCommand/EditorCommandCopyLineUp.ts'
import * as CursorCharacterLeft from '../EditorCommand/EditorCommandCursorCharacterLeft.ts'
import * as CursorCharacterRight from '../EditorCommand/EditorCommandCursorCharacterRight.ts'
import * as CursorDown from '../EditorCommand/EditorCommandCursorDown.ts'
import * as CursorEnd from '../EditorCommand/EditorCommandCursorEnd.ts'
import * as CursorHome from '../EditorCommand/EditorCommandCursorHome.ts'
import * as EditorCursorSet from '../EditorCommand/EditorCommandCursorSet.ts'
import * as CursorUp from '../EditorCommand/EditorCommandCursorUp.ts'
import * as CursorWordLeft from '../EditorCommand/EditorCommandCursorWordLeft.ts'
import * as CursorWordPartLeft from '../EditorCommand/EditorCommandCursorWordPartLeft.ts'
import * as CursorWordPartRight from '../EditorCommand/EditorCommandCursorWordPartRight.ts'
import * as CursorWordRight from '../EditorCommand/EditorCommandCursorWordRight.ts'
import * as Cut from '../EditorCommand/EditorCommandCut.ts'
import * as DeleteAllLeft from '../EditorCommand/EditorCommandDeleteAllLeft.ts'
import * as DeleteAllRight from '../EditorCommand/EditorCommandDeleteAllRight.ts'
import * as DeleteCharacterLeft from '../EditorCommand/EditorCommandDeleteCharacterLeft.ts'
import * as DeleteCharacterRight from '../EditorCommand/EditorCommandDeleteCharacterRight.ts'
import * as DeleteHorizontalRight from '../EditorCommand/EditorCommandDeleteHorizontalRight.ts'
import * as DeleteWordLeft from '../EditorCommand/EditorCommandDeleteWordLeft.ts'
import * as DeleteWordPartLeft from '../EditorCommand/EditorCommandDeleteWordPartLeft.ts'
import * as DeleteWordPartRight from '../EditorCommand/EditorCommandDeleteWordPartRight.ts'
import * as DeleteWordRight from '../EditorCommand/EditorCommandDeleteWordRight.ts'
import * as FindAllReferences from '../EditorCommand/EditorCommandFindAllReferences.ts'
import * as EditorFormat from '../EditorCommand/EditorCommandFormat.ts'
import * as EditorGoToDefinition from '../EditorCommand/EditorCommandGoToDefinition.ts'
import * as EditorGoToTypeDefinition from '../EditorCommand/EditorCommandGoToTypeDefinition.ts'
import * as ContextMenu from '../EditorCommand/EditorCommandHandleContextMenu.ts'
import * as HandleDoubleClick from '../EditorCommand/EditorCommandHandleDoubleClick.ts'
import * as HandleFocus from '../EditorCommand/EditorCommandHandleFocus.ts'
import * as HandleMouseDown from '../EditorCommand/EditorCommandHandleMouseDown.ts'
import * as HandleMouseMove from '../EditorCommand/EditorCommandHandleMouseMove.ts'
import * as EditorCommandHandleMouseMoveWithAltKey from '../EditorCommand/EditorCommandHandleMouseMoveWithAltKey.ts'
import * as EditorCommandHandleNativeBeforeInputFromContentEditable from '../EditorCommand/EditorCommandHandleNativeBeforeInputFromContentEditable.ts'
import * as HandleScrollBarHorizontalMove from '../EditorCommand/EditorCommandHandleScrollBarHorizontalMove.ts'
import * as HandleScrollBarHorizontalPointerDown from '../EditorCommand/EditorCommandHandleScrollBarHorizontalPointerDown.ts'
import * as HandleScrollBarMove from '../EditorCommand/EditorCommandHandleScrollBarMove.ts'
import * as HandleScrollBarPointerDown from '../EditorCommand/EditorCommandHandleScrollBarPointerDown.ts'
import * as HandleSingleClick from '../EditorCommand/EditorCommandHandleSingleClick.ts'
import * as HandleTouchEnd from '../EditorCommand/EditorCommandHandleTouchEnd.ts'
import * as HandleTripleClick from '../EditorCommand/EditorCommandHandleTripleClick.ts'
import * as IndentLess from '../EditorCommand/EditorCommandIndentLess.ts'
import * as IndentMore from '../EditorCommand/EditorCommandIndentMore.ts'
import * as EditorPaste from '../EditorCommand/EditorCommandPaste.ts'
import * as PasteText from '../EditorCommand/EditorCommandPasteText.ts'
import * as Save from '../EditorCommand/EditorCommandSave.ts'
import * as SelectAll from '../EditorCommand/EditorCommandSelectAll.ts'
import * as SelectAllLeft from '../EditorCommand/EditorCommandSelectAllLeft.ts'
import * as SelectAllOccurrences from '../EditorCommand/EditorCommandSelectAllOccurrences.ts'
import * as SelectAllRight from '../EditorCommand/EditorCommandSelectAllRight.ts'
import * as SelectCharacterLeft from '../EditorCommand/EditorCommandSelectCharacterLeft.ts'
import * as SelectCharacterRight from '../EditorCommand/EditorCommandSelectCharacterRight.ts'
import * as SelectDown from '../EditorCommand/EditorCommandSelectDown.ts'
import * as SelectLine from '../EditorCommand/EditorCommandSelectLine.ts'
import * as SelectNextOccurrence from '../EditorCommand/EditorCommandSelectNextOccurrence.ts'
import * as SelectPreviousOccurrence from '../EditorCommand/EditorCommandSelectPreviousOccurrence.ts'
import * as SelectUp from '../EditorCommand/EditorCommandSelectUp.ts'
import * as SelectWord from '../EditorCommand/EditorCommandSelectWord.ts'
import * as InsertLineBreak from '../EditorCommand/EditorCommandInsertLineBreak.ts'
import * as SelectWordLeft from '../EditorCommand/EditorCommandSelectWordLeft.ts'
import * as SelectWordRight from '../EditorCommand/EditorCommandSelectWordRight.ts'
import * as SelectionGrow from '../EditorCommand/EditorCommandSelectionGrow.ts'
import * as SortLinesAscending from '../EditorCommand/EditorCommandSortLinesAscending.ts'
import * as EditorTabCompletion from '../EditorCommand/EditorCommandTabCompletion.ts'
import * as EditorUndo from '../EditorCommand/EditorCommandUndo.ts'
import * as MoveLineDown from '../MoveLineDown/MoveLineDown.ts'
import * as MoveLineUp from '../MoveLineUp/MoveLineUp.ts'

export const commandMap = {
  'Editor.addCursorAbove': AddCursorAbove.addCursorAbove,
  'Editor.addCursorBelow': AddCursorBelow.addCursorBelow,
  'Editor.applyEdit': EditorApplyEdit.applyEdit,
  'Editor.braceCompletion': EditorBraceCompletion.braceCompletion,
  'Editor.cancelSelection': CancelSelection.cancelSelection,
  'Editor.closeCompletion': EditorCloseCompletion.closeCompletion,
  'Editor.compositionEnd': Composition.compositionEnd,
  'Editor.compositionStart': Composition.compositionStart,
  'Editor.compositionUpdate': Composition.compositionUpdate,
  'Editor.contextMenu': ContextMenu.handleContextMenu,
  'Editor.copy': Copy.copy,
  'Editor.copyLineDown': CopyLineDown.copyLineDown,
  'Editor.copyLineUp': CopyLineUp.copyLineUp,
  'Editor.cursorCharacterLeft': CursorCharacterLeft.cursorCharacterLeft,
  'Editor.cursorCharacterRight': CursorCharacterRight.cursorCharacterRight,
  'Editor.cursorDown': CursorDown.cursorDown,
  'Editor.cursorEnd': CursorEnd.cursorEnd,
  'Editor.cursorHome': CursorHome.cursorHome,
  'Editor.cursorLeft': CursorCharacterLeft.cursorCharacterLeft,
  'Editor.cursorRight': CursorCharacterRight.cursorCharacterRight,
  'Editor.cursorSet': EditorCursorSet.cursorSet,
  'Editor.cursorUp': CursorUp.cursorUp,
  'Editor.cursorWordLeft': CursorWordLeft.cursorWordLeft,
  'Editor.cursorWordPartLeft': CursorWordPartLeft.cursorWordPartLeft,
  'Editor.cursorWordPartRight': CursorWordPartRight.cursorWordPartRight,
  'Editor.cursorWordRight': CursorWordRight.cursorWordRight,
  'Editor.cut': Cut.cut,
  'Editor.deleteAllLeft': DeleteAllLeft.deleteAllLeft,
  'Editor.deleteAllRight': DeleteAllRight.deleteAllRight,
  'Editor.deleteCharacterLeft': DeleteCharacterLeft.deleteCharacterLeft,
  'Editor.deleteCharacterRight': DeleteCharacterRight.deleteCharacterRight,
  'Editor.deleteHorizontalRight': DeleteHorizontalRight.editorDeleteHorizontalRight,
  'Editor.deleteLeft': DeleteCharacterLeft.deleteCharacterLeft,
  'Editor.deleteRight': DeleteCharacterRight.deleteCharacterRight,
  'Editor.deleteWordLeft': DeleteWordLeft.deleteWordLeft,
  'Editor.deleteWordPartLeft': DeleteWordPartLeft.deleteWordPartLeft,
  'Editor.deleteWordPartRight': DeleteWordPartRight.deleteWordPartRight,
  'Editor.deleteWordRight': DeleteWordRight.deleteWordRight,
  'Editor.findAllReferences': FindAllReferences.findAllReferences,
  'Editor.format': EditorFormat.format,
  'Editor.goToDefinition': EditorGoToDefinition.goToDefinition,
  'Editor.goToTypeDefinition': EditorGoToTypeDefinition.goToTypeDefinition,
  'Editor.handleBeforeInputFromContentEditable': EditorCommandHandleNativeBeforeInputFromContentEditable.handleBeforeInputFromContentEditable,
  'Editor.handleDoubleClick': HandleDoubleClick.handleDoubleClick,
  'Editor.handleFocus': HandleFocus.handleFocus,
  'Editor.handleMouseDown': HandleMouseDown.handleMouseDown,
  'Editor.handleMouseMove': HandleMouseMove.handleMouseMove,
  'Editor.handleMouseMoveWithAltKey': EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey,
  'Editor.handleScrollBarClick': HandleScrollBarPointerDown.handleScrollBarPointerDown,
  'Editor.handleScrollBarHorizontalMove': HandleScrollBarHorizontalMove.handleScrollBarHorizontalMove,
  'Editor.handleScrollBarHorizontalPointerDown': HandleScrollBarHorizontalPointerDown.handleScrollBarHorizontalPointerDown,
  'Editor.handleScrollBarMove': HandleScrollBarMove.handleScrollBarMove,
  'Editor.handleSingleClick': HandleSingleClick.handleSingleClick,
  'Editor.handleTouchEnd': HandleTouchEnd.handleTouchEnd,
  'Editor.handleTripleClick': HandleTripleClick.handleTripleClick,
  'Editor.indendLess': IndentLess.indentLess,
  'Editor.indentMore': IndentMore.indentMore,
  'Editor.insertLineBreak': InsertLineBreak.insertLineBreak,
  'Editor.moveLineDown': MoveLineDown.moveLineDown,
  'Editor.moveLineUp': MoveLineUp.moveLineUp,
  'Editor.paste': EditorPaste.paste,
  'Editor.pasteText': PasteText.pasteText,
  'Editor.save': Save.save,
  'Editor.selectAll': SelectAll.selectAll,
  'Editor.selectAllLeft': SelectAllLeft.editorSelectAllLeft,
  'Editor.selectAllOccurrences': SelectAllOccurrences.selectAllOccurrences,
  'Editor.selectAllRight': SelectAllRight.editorSelectAllRight,
  'Editor.selectCharacterLeft': SelectCharacterLeft.selectCharacterLeft,
  'Editor.selectCharacterRight': SelectCharacterRight.selectCharacterRight,
  'Editor.selectDown': SelectDown.selectDown,
  'Editor.selectionGrow': SelectionGrow.selectionGrow,
  'Editor.selectLine': SelectLine.selectLine,
  'Editor.selectNextOccurrence': SelectNextOccurrence.selectNextOccurrence,
  'Editor.selectPreviousOccurrence': SelectPreviousOccurrence.selectPreviousOccurrence,
  'Editor.selectUp': SelectUp.selectUp,
  'Editor.selectWord': SelectWord.selectWord,
  'Editor.selectWordLeft': SelectWordLeft.selectWordLeft,
  'Editor.selectWordRight': SelectWordRight.selectWordRight,
  'Editor.sortLinesAscending': SortLinesAscending.sortLinesAscending,
  'Editor.tabCompletion': EditorTabCompletion.tabCompletion,
  'Editor.undo': EditorUndo.undo,
}
