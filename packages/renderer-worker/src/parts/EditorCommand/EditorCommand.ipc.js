import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorApplyEdit from './EditorCommandApplyEdit.js'
import * as EditorBlur from './EditorCommandBlur.js'
import * as EditorCancelSelection from './EditorCommandCancelSelection.js'
import * as EditorCompletion from './EditorCommandCompletion.js'
import * as EditorComposition from './EditorCommandComposition.js'
import * as EditorCopy from './EditorCommandCopy.js'
import * as EditorCopyLineDown from './EditorCommandCopyLineDown.js'
import * as EditorCopyLineUp from './EditorCommandCopyLineUp.js'
import * as EditorCursorCharacterLeft from './EditorCommandCursorCharacterLeft.js'
import * as EditorCursorCharacterRight from './EditorCommandCursorCharacterRight.js'
import * as EditorCursorDown from './EditorCommandCursorDown.js'
import * as EditorCursorEnd from './EditorCommandCursorEnd.js'
import * as EditorCursorHome from './EditorCommandCursorHome.js'
import * as EditorCursorSet from './EditorCommandCursorSet.js'
import * as EditorCursorUp from './EditorCommandCursorUp.js'
import * as EditorCursorWordLeft from './EditorCommandCursorWordLeft.js'
import * as EditorCursorWordPartLeft from './EditorCommandCursorWordPartLeft.js'
import * as EditorCursorWordPartRight from './EditorCommandCursorWordPartRight.js'
import * as EditorCursorWordRight from './EditorCommandCursorWordRight.js'
import * as EditorCut from './EditorCommandCut.js'
import * as EditorDeleteAllLeft from './EditorCommandDeleteAllLeft.js'
import * as EditorDeleteAllRight from './EditorCommandDeleteAllRight.js'
import * as EditorDeleteLeft from './EditorCommandDeleteCharacterLeft.js'
import * as EditorDeleteRight from './EditorCommandDeleteCharacterRight.js'
import * as EditorDeleteWordLeft from './EditorCommandDeleteWordLeft.js'
import * as EditorDeleteWordPartLeft from './EditorCommandDeleteWordPartLeft.js'
import * as EditorDeleteWordPartRight from './EditorCommandDeleteWordPartRight.js'
import * as EditorDeleteWordRight from './EditorCommandDeleteWordRight.js'
import * as EditorFormat from './EditorCommandFormat.js'
import * as EditorGoToDefinition from './EditorCommandGoToDefinition.js'
import * as EditorGoToTypeDefinition from './EditorCommandGoToTypeDefinition.js'
import * as EditorHandleContextMenu from './EditorCommandHandleContextMenu.js'
import * as EditorHandleDoubleClick from './EditorCommandHandleDoubleClick.js'
import * as EditorHandleMouseMove from './EditorCommandHandleMouseMove.js'
import * as EditorHandleMouseMoveWithAltKey from './EditorCommandHandleMouseMoveWithAltKey.js'
import * as EditorHandleBeforeInputFromContentEditable from './EditorCommandHandleNativeBeforeInputFromContentEditable.js'
import * as EditorHandleNativeSelectionChange from './EditorCommandHandleNativeSelectionChange.js'
import * as EditorHandleScrollBarClick from './EditorCommandHandleScrollBarClick.js'
import * as EditorHandleScrollBarMove from './EditorCommandHandleScrollBarMove.js'
import * as EditorHandleSingleClick from './EditorCommandHandleSingleClick.js'
import * as EditorHandleTab from './EditorCommandHandleTab.js'
import * as EditorHandleTouchEnd from './EditorCommandHandleTouchEnd.js'
import * as EditorHandleTouchMove from './EditorCommandHandleTouchMove.js'
import * as EditorHandleTouchStart from './EditorCommandHandleTouchStart.js'
import * as EditorHandleTripleClick from './EditorCommandHandleTripleClick.js'
import * as EditorCommandIndentLess from './EditorCommandIndentLess.js'
import * as EditorCommandIndentMore from './EditorCommandIndentMore.js'
import * as EditorInsertLineBreak from './EditorCommandInsertLineBreak.js'
import * as EditorMoveLineDown from './EditorCommandMoveLineDown.js'
import * as EditorMoveLineUp from './EditorCommandMoveLineUp.js'
import * as EditorMoveRectangleSelection from './EditorCommandMoveRectangleSelection.js'
import * as EditorMoveRectangleSelectionPx from './EditorCommandMoveRectangleSelectionPx.js'
import * as EditorMoveSelection from './EditorCommandMoveSelection.js'
import * as EditorMoveSelectionPx from './EditorCommandMoveSelectionPx.js'
import * as EditorPaste from './EditorCommandPaste.js'
import * as EditorPasteText from './EditorCommandPasteText.js'
import * as EditorSave from './EditorCommandSave.js'
import * as EditorSelectAll from './EditorCommandSelectAll.js'
import * as EditorSelectAllOccurrences from './EditorCommandSelectAllOccurrences.js'
import * as EditorSelectCharacterLeft from './EditorCommandSelectCharacterLeft.js'
import * as EditorSelectCharacterRight from './EditorCommandSelectCharacterRight.js'
import * as EditorSelectInsideString from './EditorCommandSelectInsideString.js'
import * as EditorSelectLine from './EditorCommandSelectLine.js'
import * as EditorSelectNextOccurrence from './EditorCommandSelectNextOccurrence.js'
import * as EditorSelectWord from './EditorCommandSelectWord.js'
import * as EditorSelectWordLeft from './EditorCommandSelectWordLeft.js'
import * as EditorSelectWordRight from './EditorCommandSelectWordRight.js'
import * as EditorSetDecorations from './EditorCommandSetDecorations.js'
import * as EditorSetDeltaY from './EditorCommandSetDeltaY.js'
import * as EditorSetLanguageId from './EditorCommandSetLanguageId.js'
import * as EditorTabCompletion from './EditorCommandTabCompletion.js'
import * as EditorToggleBlockComment from './EditorCommandToggleBlockComment.js'
import * as EditorToggleComment from './EditorCommandToggleComment.js'
import * as EditorType from './EditorCommandType.js'
import * as EditorUndo from './EditorCommandUndo.js'
import * as EditorUnindent from './EditorCommandUnindent.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.applyEdit', Viewlet.wrapViewletCommand('EditorText', EditorApplyEdit.editorApplyEdit))
  Command.register('Editor.blur', Viewlet.wrapViewletCommand('EditorText', EditorBlur.editorBlur)) // TODO needed?
  Command.register('Editor.cancelSelection', Viewlet.wrapViewletCommand('EditorText', EditorCancelSelection.editorCancelSelection))
  Command.register('Editor.close', Viewlet.wrapViewletCommand('EditorText', EditorCompletion.close))
  Command.register('Editor.compositionEnd', Viewlet.wrapViewletCommand('EditorText', EditorComposition.editorCompositionEnd))
  Command.register('Editor.compositionStart', Viewlet.wrapViewletCommand('EditorText', EditorComposition.editorCompositionStart))
  Command.register('Editor.compositionUpdate', Viewlet.wrapViewletCommand('EditorText', EditorComposition.editorCompositionUpdate))
  Command.register('Editor.copy', Viewlet.wrapViewletCommand('EditorText', EditorCopy.editorCopy))
  Command.register('Editor.copyLineDown', Viewlet.wrapViewletCommand('EditorText', EditorCopyLineDown.editorCopyLineDown))
  Command.register('Editor.copyLineUp', Viewlet.wrapViewletCommand('EditorText', EditorCopyLineUp.editorCopyLineUp))
  Command.register('Editor.cursorCharacterLeft', Viewlet.wrapViewletCommand('EditorText', EditorCursorCharacterLeft.editorCursorCharacterLeft))
  Command.register('Editor.cursorLeft', Viewlet.wrapViewletCommand('EditorText', EditorCursorCharacterLeft.editorCursorCharacterLeft))
  Command.register('Editor.cursorRight', Viewlet.wrapViewletCommand('EditorText', EditorCursorCharacterRight.editorCursorsCharacterRight))
  Command.register('Editor.cursorEnd', Viewlet.wrapViewletCommand('EditorText', EditorCursorEnd.editorCursorEnd))
  Command.register('Editor.cursorCharacterRight', Viewlet.wrapViewletCommand('EditorText', EditorCursorCharacterRight.editorCursorsCharacterRight))
  Command.register('Editor.cursorDown', Viewlet.wrapViewletCommand('EditorText', EditorCursorDown.editorCursorsDown))
  Command.register('Editor.cursoret', Viewlet.wrapViewletCommand('EditorText', EditorCursorSet.editorCursorSet))
  Command.register('Editor.cursorHome', Viewlet.wrapViewletCommand('EditorText', EditorCursorHome.editorCursorsHome))
  Command.register('Editor.cursorUp', Viewlet.wrapViewletCommand('EditorText', EditorCursorUp.editorCursorsUp))
  Command.register('Editor.cursorWordLeft', Viewlet.wrapViewletCommand('EditorText', EditorCursorWordLeft.editorCursorWordLeft))
  Command.register('Editor.cursorWordPartLeft', Viewlet.wrapViewletCommand('EditorText', EditorCursorWordPartLeft.editorCursorWordPartLeft))
  Command.register('Editor.cursorWordPartRight', Viewlet.wrapViewletCommand('EditorText', EditorCursorWordPartRight.editorCursorWordPartRight))
  Command.register('Editor.cursorWordRight', Viewlet.wrapViewletCommand('EditorText', EditorCursorWordRight.editorCursorWordRight))
  Command.register('Editor.cut', Viewlet.wrapViewletCommand('EditorText', EditorCut.editorCut))
  Command.register('Editor.deleteAllLeft', Viewlet.wrapViewletCommand('EditorText', EditorDeleteAllLeft.editorDeleteAllLeft))
  Command.register('Editor.deleteAllRight', Viewlet.wrapViewletCommand('EditorText', EditorDeleteAllRight.editorDeleteAllRight))
  Command.register('Editor.deleteCharacterLeft', Viewlet.wrapViewletCommand('EditorText', EditorDeleteLeft.editorDeleteCharacterLeft))
  Command.register('Editor.deleteCharacterRight', Viewlet.wrapViewletCommand('EditorText', EditorDeleteRight.editorDeleteCharacterRight))
  Command.register('Editor.deleteWordLeft', Viewlet.wrapViewletCommand('EditorText', EditorDeleteWordLeft.editorDeleteWordLeft))
  Command.register('Editor.deleteWordPartLeft', Viewlet.wrapViewletCommand('EditorText', EditorDeleteWordPartLeft.editorDeleteWordPartLeft))
  Command.register('Editor.deleteWordPartRight', Viewlet.wrapViewletCommand('EditorText', EditorDeleteWordPartRight.editorDeleteWordPartRight))
  Command.register('Editor.deleteWordRight', Viewlet.wrapViewletCommand('EditorText', EditorDeleteWordRight.editorDeleteWordRight))
  Command.register('Editor.format', Viewlet.wrapViewletCommand('EditorText', EditorFormat.editorFormat))
  Command.register('Editor.goToDefinition', Viewlet.wrapViewletCommand('EditorText', EditorGoToDefinition.editorGoToDefinition))
  Command.register('Editor.goToTypeDefinition', Viewlet.wrapViewletCommand('EditorText', EditorGoToTypeDefinition.editorGoToTypeDefinition))
  Command.register('Editor.handleBeforeInputFromContentEditable', Viewlet.wrapViewletCommand('EditorText', EditorHandleBeforeInputFromContentEditable.handleBeforeInputFromContentEditable))
  Command.register('Editor.handleContextMenu', Viewlet.wrapViewletCommand('EditorText', EditorHandleContextMenu.editorHandleContextMenu))
  Command.register('Editor.handleDoubleClick', Viewlet.wrapViewletCommand('EditorText', EditorHandleDoubleClick.editorHandleDoubleClick))
  Command.register('Editor.handleMouseMove', Viewlet.wrapViewletCommand('EditorText', EditorHandleMouseMove.editorHandleMouseMove))
  Command.register('Editor.handleMouseMoveWithAltKey', Viewlet.wrapViewletCommand('EditorText', EditorHandleMouseMoveWithAltKey.editorHandleMouseMoveWithAltKey))
  Command.register('Editor.handleNativeSelectionChange', Viewlet.wrapViewletCommand('EditorText', EditorHandleNativeSelectionChange.editorHandleNativeSelectionChange))
  Command.register('Editor.handleScrollBarClick', Viewlet.wrapViewletCommand('EditorText', EditorHandleScrollBarClick.editorHandleScrollBarClick))
  Command.register('Editor.handleScrollBarMove', Viewlet.wrapViewletCommand('EditorText', EditorHandleScrollBarMove.editorHandleScrollBarMove))
  Command.register('Editor.handleSingleClick', Viewlet.wrapViewletCommand('EditorText', EditorHandleSingleClick.editorHandleSingleClick))
  Command.register('Editor.handleTab', Viewlet.wrapViewletCommand('EditorText', EditorHandleTab.editorHandleTab))
  Command.register('Editor.handleTouchEnd', Viewlet.wrapViewletCommand('EditorText', EditorHandleTouchEnd.editorHandleTouchEnd))
  Command.register('Editor.handleTouchMove', Viewlet.wrapViewletCommand('EditorText', EditorHandleTouchMove.editorHandleTouchMove))
  Command.register('Editor.handleTouchStart', Viewlet.wrapViewletCommand('EditorText', EditorHandleTouchStart.editorHandleTouchStart))
  Command.register('Editor.handleTripleClick', Viewlet.wrapViewletCommand('EditorText', EditorHandleTripleClick.editorHandleTripleClick))
  Command.register('Editor.indentLess', Viewlet.wrapViewletCommand('EditorText', EditorCommandIndentLess.editorIndentLess))
  Command.register('Editor.indentMore', Viewlet.wrapViewletCommand('EditorText', EditorCommandIndentMore.editorIndentMore))
  Command.register('Editor.insertLineBreak', Viewlet.wrapViewletCommand('EditorText', EditorInsertLineBreak.editorInsertLineBreak))
  Command.register('Editor.moveLineDown', Viewlet.wrapViewletCommand('EditorText', EditorMoveLineDown.editorMoveLineDown))
  Command.register('Editor.moveLineUp', Viewlet.wrapViewletCommand('EditorText', EditorMoveLineUp.editorMoveLineUp))
  Command.register('Editor.moveRectangleSelection', Viewlet.wrapViewletCommand('EditorText', EditorMoveRectangleSelection.editorMoveRectangleSelection))
  Command.register('Editor.moveRectangleSelectionPx', Viewlet.wrapViewletCommand('EditorText', EditorMoveRectangleSelectionPx.editorMoveRectangleSelectionPx))
  Command.register('Editor.moveSelection', Viewlet.wrapViewletCommand('EditorText', EditorMoveSelection.editorMoveSelection))
  Command.register('Editor.moveSelectionPx', Viewlet.wrapViewletCommand('EditorText', EditorMoveSelectionPx.editorMoveSelectionPx))
  Command.register('Editor.openCompletion', Viewlet.wrapViewletCommand('EditorText', EditorCompletion.open))
  Command.register('Editor.openCompletionFromType', Viewlet.wrapViewletCommand('EditorText', EditorCompletion.openFromType))
  Command.register('Editor.paste', Viewlet.wrapViewletCommand('EditorText', EditorPaste.editorPaste))
  Command.register('Editor.pasteText', Viewlet.wrapViewletCommand('EditorText', EditorPasteText.editorPasteText))
  Command.register('Editor.save', Viewlet.wrapViewletCommand('EditorText', EditorSave.editorSave))
  Command.register('Editor.selectAll', Viewlet.wrapViewletCommand('EditorText', EditorSelectAll.editorSelectAll))
  Command.register('Editor.selectAllOccurrences', Viewlet.wrapViewletCommand('EditorText', EditorSelectAllOccurrences.editorSelectAllOccurrences))
  Command.register('Editor.selectCharacterLeft', Viewlet.wrapViewletCommand('EditorText', EditorSelectCharacterLeft.editorSelectCharacterLeft))
  Command.register('Editor.selectCharacterRight', Viewlet.wrapViewletCommand('EditorText', EditorSelectCharacterRight.editorSelectCharacterRight))
  Command.register('Editor.selectInsideString', Viewlet.wrapViewletCommand('EditorText', EditorSelectInsideString.editorSelectInsideString))
  Command.register('Editor.selectLine', Viewlet.wrapViewletCommand('EditorText', EditorSelectLine.editorSelectLine))
  Command.register('Editor.selectNextOccurrence', Viewlet.wrapViewletCommand('EditorText', EditorSelectNextOccurrence.editorSelectNextOccurrence))
  Command.register('Editor.selectWord', Viewlet.wrapViewletCommand('EditorText', EditorSelectWord.editorSelectWord))
  Command.register('Editor.selectWordLeft', Viewlet.wrapViewletCommand('EditorText', EditorSelectWordLeft.editorSelectWordLeft))
  Command.register('Editor.selectWordRight', Viewlet.wrapViewletCommand('EditorText', EditorSelectWordRight.editorSelectWordRight))
  Command.register('Editor.setDecorations', Viewlet.wrapViewletCommand('EditorText', EditorSetDecorations.setDecorations))
  Command.register('Editor.setDeltaY', Viewlet.wrapViewletCommand('EditorText', EditorSetDeltaY.editorSetDeltaY))
  Command.register('Editor.setLanguageId', Viewlet.wrapViewletCommand('EditorText', EditorSetLanguageId.setLanguageId))
  Command.register('Editor.tabCompletion', Viewlet.wrapViewletCommand('EditorText', EditorTabCompletion.editorTabCompletion))
  Command.register('Editor.toggleBlockComment', Viewlet.wrapViewletCommand('EditorText', EditorToggleBlockComment.editorToggleBlockComment))
  Command.register('Editor.toggleComment', Viewlet.wrapViewletCommand('EditorText', EditorToggleComment.editorToggleComment))
  Command.register('Editor.type', Viewlet.wrapViewletCommand('EditorText', EditorType.editorType))
  Command.register('Editor.undo', Viewlet.wrapViewletCommand('EditorText', EditorUndo.editorUndo))
  Command.register('Editor.unindent', Viewlet.wrapViewletCommand('EditorText', EditorUnindent.editorUnindent))
    // TODO command to set cursor position
  // TODO command copy line up/down
  // TODO command move line up/down
}
