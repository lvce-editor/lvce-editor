import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
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
import * as EditorHandleContextMenu from './EditorCommandHandleContextMenu.js'
import * as EditorHandleDoubleClick from './EditorCommandHandleDoubleClick.js'
import * as EditorHandleMouseMove from './EditorCommandHandleMouseMove.js'
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
import * as EditorSetDeltaY from './EditorCommandSetDeltaY.js'
import * as EditorTabCompletion from './EditorCommandTabCompletion.js'
import * as EditorToggleBlockComment from './EditorCommandToggleBlockComment.js'
import * as EditorToggleComment from './EditorCommandToggleComment.js'
import * as EditorType from './EditorCommandType.js'
import * as EditorUndo from './EditorCommandUndo.js'
import * as EditorUnindent from './EditorCommandUnindent.js'
import * as EditorSetLanguageId from './EditorCommandSetLanguageId.js'
import * as EditorHandleMouseMoveWithAltKey from './EditorCommandHandleMouseMoveWithAltKey.js'
import * as EditorGoToTypeDefinition from './EditorCommandGoToTypeDefinition.js'
import * as EditorApplyEdit from './EditorCommandApplyEdit.js'
import * as EditorSetDecorations from './EditorCommandSetDecorations.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('EditorCursorDown.editorCursorsDown', Viewlet.wrapViewletCommand('EditorText', EditorCursorDown.editorCursorsDown))
  Command.register('EditorCursorCharacterLeft.editorCursorCharacterLeft', Viewlet.wrapViewletCommand('EditorText', EditorCursorCharacterLeft.editorCursorCharacterLeft))
  Command.register('EditorCursorCharacterRight.editorCursorsCharacterRight', Viewlet.wrapViewletCommand('EditorText', EditorCursorCharacterRight.editorCursorsCharacterRight))
  Command.register('EditorCursorUp.editorCursorsUp', Viewlet.wrapViewletCommand('EditorText', EditorCursorUp.editorCursorsUp))
  Command.register('EditorType.editorType', Viewlet.wrapViewletCommand('EditorText', EditorType.editorType))
  Command.register('EditorDeleteLeft.editorDeleteCharacterLeft', Viewlet.wrapViewletCommand('EditorText', EditorDeleteLeft.editorDeleteCharacterLeft))
  Command.register('EditorDeleteRight.editorDeleteCharacterRight', Viewlet.wrapViewletCommand('EditorText', EditorDeleteRight.editorDeleteCharacterRight))
  Command.register('EditorInsertLineBreak.editorInsertLineBreak', Viewlet.wrapViewletCommand('EditorText', EditorInsertLineBreak.editorInsertLineBreak))
  Command.register('EditorCopyLineUp.editorCopyLineUp', Viewlet.wrapViewletCommand('EditorText', EditorCopyLineUp.editorCopyLineUp))
  Command.register('EditorCopyLineDown.editorCopyLineDown', Viewlet.wrapViewletCommand('EditorText', EditorCopyLineDown.editorCopyLineDown))
  Command.register('EditorMoveLineDown.editorMoveLineDown', Viewlet.wrapViewletCommand('EditorText', EditorMoveLineDown.editorMoveLineDown))
  Command.register('EditorCursorWordLeft.editorCursorWordLeft', Viewlet.wrapViewletCommand('EditorText', EditorCursorWordLeft.editorCursorWordLeft))
  Command.register('EditorCursorWordRight.editorCursorWordRight', Viewlet.wrapViewletCommand('EditorText', EditorCursorWordRight.editorCursorWordRight))
  Command.register('EditorDeleteWordLeft.editorDeleteWordLeft', Viewlet.wrapViewletCommand('EditorText', EditorDeleteWordLeft.editorDeleteWordLeft))
  Command.register('EditorDeleteWordRight.editorDeleteWordRight', Viewlet.wrapViewletCommand('EditorText', EditorDeleteWordRight.editorDeleteWordRight))
  Command.register('EditorMoveLineUp.editorMoveLineUp', Viewlet.wrapViewletCommand('EditorText', EditorMoveLineUp.editorMoveLineUp))
  Command.register('EditorTabCompletion.editorTabCompletion', Viewlet.wrapViewletCommand('EditorText', EditorTabCompletion.editorTabCompletion))
  Command.register('EditorCursorHome.editorCursorsHome', Viewlet.wrapViewletCommand('EditorText', EditorCursorHome.editorCursorsHome))
  Command.register('EditorCursorEnd.editorCursorEnd', Viewlet.wrapViewletCommand('EditorText', EditorCursorEnd.editorCursorEnd))
  Command.register('EditorHandleSingleClick.editorHandleSingleClick', Viewlet.wrapViewletCommand('EditorText', EditorHandleSingleClick.editorHandleSingleClick))
  Command.register('EditorSelectWord.editorSelectWord', Viewlet.wrapViewletCommand('EditorText', EditorSelectWord.editorSelectWord))
  Command.register('EditorToggleBlockComment.editorToggleBlockComment', Viewlet.wrapViewletCommand('EditorText', EditorToggleBlockComment.editorToggleBlockComment))
  Command.register('EditorMoveSelection.editorMoveSelection', Viewlet.wrapViewletCommand('EditorText', EditorMoveSelection.editorMoveSelection))
  Command.register('EditorCut.editorCut', Viewlet.wrapViewletCommand('EditorText', EditorCut.editorCut))
  Command.register('EditorCopy.editorCopy', Viewlet.wrapViewletCommand('EditorText', EditorCopy.editorCopy))
  Command.register('EditorSelectAll.editorSelectAll', Viewlet.wrapViewletCommand('EditorText', EditorSelectAll.editorSelectAll))
  Command.register('EditorMoveRectangleSelection.editorMoveRectangleSelection', Viewlet.wrapViewletCommand('EditorText', EditorMoveRectangleSelection.editorMoveRectangleSelection))
  Command.register('EditorCursorWordPartRight.editorCursorWordPartRight', Viewlet.wrapViewletCommand('EditorText', EditorCursorWordPartRight.editorCursorWordPartRight))
  Command.register('EditorCursorWordPartLeft.editorCursorWordPartLeft', Viewlet.wrapViewletCommand('EditorText', EditorCursorWordPartLeft.editorCursorWordPartLeft))
  Command.register('EditorBlur.editorBlur', Viewlet.wrapViewletCommand('EditorText', EditorBlur.editorBlur)) // TODO needed?
  Command.register('EditorToggleComment.editorToggleComment', Viewlet.wrapViewletCommand('EditorText', EditorToggleComment.editorToggleComment))
  Command.register('EditorDeleteAllLeft.editorDeleteAllLeft', Viewlet.wrapViewletCommand('EditorText', EditorDeleteAllLeft.editorDeleteAllLeft))
  Command.register('EditorDeleteAllRight.editorDeleteAllRight', Viewlet.wrapViewletCommand('EditorText', EditorDeleteAllRight.editorDeleteAllRight))
  Command.register('EditorHandleTripleClick.editorHandleTripleClick', Viewlet.wrapViewletCommand('EditorText', EditorHandleTripleClick.editorHandleTripleClick))
  Command.register('EditorSelectLine.editorSelectLine', Viewlet.wrapViewletCommand('EditorText', EditorSelectLine.editorSelectLine))
  Command.register('EditorSave.editorSave', Viewlet.wrapViewletCommand('EditorText', EditorSave.editorSave))
  Command.register('EditorHandleContextMenu.editorHandleContextMenu', Viewlet.wrapViewletCommand('EditorText', EditorHandleContextMenu.editorHandleContextMenu))
  Command.register('EditorSelectCharacterLeft.editorSelectCharacterLeft', Viewlet.wrapViewletCommand('EditorText', EditorSelectCharacterLeft.editorSelectCharacterLeft))
  Command.register('EditorSelectCharacterRight.editorSelectCharacterRight', Viewlet.wrapViewletCommand('EditorText', EditorSelectCharacterRight.editorSelectCharacterRight))
  Command.register('EditorPasteText.editorPasteText', Viewlet.wrapViewletCommand('EditorText', EditorPasteText.editorPasteText))
  Command.register('EditorPaste.editorPaste', Viewlet.wrapViewletCommand('EditorText', EditorPaste.editorPaste))
  Command.register('EditorSetDeltaY.editorSetDeltaY', Viewlet.wrapViewletCommand('EditorText', EditorSetDeltaY.editorSetDeltaY))
  Command.register('EditorHandleDoubleClick.editorHandleDoubleClick', Viewlet.wrapViewletCommand('EditorText', EditorHandleDoubleClick.editorHandleDoubleClick))
  Command.register('EditorMoveSelectionPx.editorMoveSelectionPx', Viewlet.wrapViewletCommand('EditorText', EditorMoveSelectionPx.editorMoveSelectionPx))
  Command.register('EditorMoveRectangleSelectionPx.editorMoveRectangleSelectionPx', Viewlet.wrapViewletCommand('EditorText', EditorMoveRectangleSelectionPx.editorMoveRectangleSelectionPx))
  Command.register('EditorFormat.editorFormat', Viewlet.wrapViewletCommand('EditorText', EditorFormat.editorFormat))
  Command.register('EditorHandleMouseMove.editorHandleMouseMove', Viewlet.wrapViewletCommand('EditorText', EditorHandleMouseMove.editorHandleMouseMove))
  Command.register('EditorSelectNextOccurrence.editorSelectNextOccurrence', Viewlet.wrapViewletCommand('EditorText', EditorSelectNextOccurrence.editorSelectNextOccurrence))
  Command.register('EditorSelectAllOccurrences.editorSelectAllOccurrences', Viewlet.wrapViewletCommand('EditorText', EditorSelectAllOccurrences.editorSelectAllOccurrences))
  Command.register('EditorHandleTab.editorHandleTab', Viewlet.wrapViewletCommand('EditorText', EditorHandleTab.editorHandleTab))
  Command.register('EditorCancelSelection.editorCancelSelection', Viewlet.wrapViewletCommand('EditorText', EditorCancelSelection.editorCancelSelection))
  Command.register('EditorUnindent.editorUnindent', Viewlet.wrapViewletCommand('EditorText', EditorUnindent.editorUnindent))
  Command.register('EditorUndo.editorUndo', Viewlet.wrapViewletCommand('EditorText', EditorUndo.editorUndo))
  Command.register('EditorCursorSet.editorCursorSet', Viewlet.wrapViewletCommand('EditorText', EditorCursorSet.editorCursorSet))
  Command.register('EditorDeleteWordPartLeft.editorDeleteWordPartLeft', Viewlet.wrapViewletCommand('EditorText', EditorDeleteWordPartLeft.editorDeleteWordPartLeft))
  Command.register('EditorDeleteWordPartRight.editorDeleteWordPartRight', Viewlet.wrapViewletCommand('EditorText', EditorDeleteWordPartRight.editorDeleteWordPartRight))
  Command.register('EditorHandleScrollBarMove.editorHandleScrollBarMove', Viewlet.wrapViewletCommand('EditorText', EditorHandleScrollBarMove.editorHandleScrollBarMove))
  Command.register('EditorHandleScrollBarClick.editorHandleScrollBarClick', Viewlet.wrapViewletCommand('EditorText', EditorHandleScrollBarClick.editorHandleScrollBarClick))
  Command.register('EditorSelectWordRight.editorSelectWordRight', Viewlet.wrapViewletCommand('EditorText', EditorSelectWordRight.editorSelectWordRight))
  Command.register('EditorSelectWordLeft.editorSelectWordLeft', Viewlet.wrapViewletCommand('EditorText', EditorSelectWordLeft.editorSelectWordLeft))
  Command.register('EditorSelectInsideString.editorSelectInsideString', Viewlet.wrapViewletCommand('EditorText', EditorSelectInsideString.editorSelectInsideString))
  Command.register('EditorHandleTouchStart.editorHandleTouchStart', Viewlet.wrapViewletCommand('EditorText', EditorHandleTouchStart.editorHandleTouchStart))
  Command.register('EditorHandleTouchMove.editorHandleTouchMove', Viewlet.wrapViewletCommand('EditorText', EditorHandleTouchMove.editorHandleTouchMove))
  Command.register('EditorHandleTouchEnd.editorHandleTouchEnd', Viewlet.wrapViewletCommand('EditorText', EditorHandleTouchEnd.editorHandleTouchEnd))
  Command.register('EditorHandleBeforeInputFromContentEditable.handleBeforeInputFromContentEditable', Viewlet.wrapViewletCommand('EditorText', EditorHandleBeforeInputFromContentEditable.handleBeforeInputFromContentEditable))
  Command.register('EditorHandleNativeSelectionChange.editorHandleNativeSelectionChange', Viewlet.wrapViewletCommand('EditorText', EditorHandleNativeSelectionChange.editorHandleNativeSelectionChange))
  Command.register('EditorCommandIndentMore.editorIndentMore', Viewlet.wrapViewletCommand('EditorText', EditorCommandIndentMore.editorIndentMore))
  Command.register('EditorCommandIndentLess.editorIndentLess', Viewlet.wrapViewletCommand('EditorText', EditorCommandIndentLess.editorIndentLess))
  Command.register('EditorComposition.editorCompositionStart', Viewlet.wrapViewletCommand('EditorText', EditorComposition.editorCompositionStart))
  Command.register('EditorComposition.editorCompositionUpdate', Viewlet.wrapViewletCommand('EditorText', EditorComposition.editorCompositionUpdate))
  Command.register('EditorComposition.editorCompositionEnd', Viewlet.wrapViewletCommand('EditorText', EditorComposition.editorCompositionEnd))
  Command.register('EditorGoToDefinition.editorGoToDefinition', Viewlet.wrapViewletCommand('EditorText', EditorGoToDefinition.editorGoToDefinition))
  Command.register('EditorHandleMouseMoveWithAltKey.editorHandleMouseMoveWithAltKey', Viewlet.wrapViewletCommand('EditorText', EditorHandleMouseMoveWithAltKey.editorHandleMouseMoveWithAltKey))
  Command.register('EditorCompletion.open', Viewlet.wrapViewletCommand('EditorText', EditorCompletion.open))
  Command.register('EditorCompletion.close', Viewlet.wrapViewletCommand('EditorText', EditorCompletion.close))
  Command.register('EditorCompletion.openFromType', Viewlet.wrapViewletCommand('EditorText', EditorCompletion.openFromType))
  Command.register('EditorSetLanguageId.setLanguageId', Viewlet.wrapViewletCommand('EditorText', EditorSetLanguageId.setLanguageId))
  Command.register('EditorGoToTypeDefinition.editorGoToTypeDefinition', Viewlet.wrapViewletCommand('EditorText', EditorGoToTypeDefinition.editorGoToTypeDefinition))
  Command.register('EditorApplyEdit.editorApplyEdit', Viewlet.wrapViewletCommand('EditorText', EditorApplyEdit.editorApplyEdit))
  Command.register('EditorSetDecorations.setDecorations', Viewlet.wrapViewletCommand('EditorText', EditorSetDecorations.setDecorations))
    // TODO command to set cursor position
  // TODO command copy line up/down
  // TODO command move line up/down
}
