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

export const __initialize__ = () => {
  Command.register(341, Viewlet.wrapViewletCommand('EditorText', EditorCursorDown.editorCursorsDown))
  Command.register(342, Viewlet.wrapViewletCommand('EditorText', EditorCursorCharacterLeft.editorCursorCharacterLeft))
  Command.register(343, Viewlet.wrapViewletCommand('EditorText', EditorCursorCharacterRight.editorCursorsCharacterRight))
  Command.register(344, Viewlet.wrapViewletCommand('EditorText', EditorCursorUp.editorCursorsUp))
  Command.register(345, Viewlet.wrapViewletCommand('EditorText', EditorType.editorType))
  Command.register(346, Viewlet.wrapViewletCommand('EditorText', EditorDeleteLeft.editorDeleteCharacterLeft))
  Command.register(347, Viewlet.wrapViewletCommand('EditorText', EditorDeleteRight.editorDeleteCharacterRight))
  Command.register(348, Viewlet.wrapViewletCommand('EditorText', EditorInsertLineBreak.editorInsertLineBreak))
  Command.register(349, Viewlet.wrapViewletCommand('EditorText', EditorCopyLineUp.editorCopyLineUp))
  Command.register(350, Viewlet.wrapViewletCommand('EditorText', EditorCopyLineDown.editorCopyLineDown))
  Command.register(351, Viewlet.wrapViewletCommand('EditorText', EditorMoveLineDown.editorMoveLineDown))
  Command.register(352, Viewlet.wrapViewletCommand('EditorText', EditorCursorWordLeft.editorCursorWordLeft))
  Command.register(353, Viewlet.wrapViewletCommand('EditorText', EditorCursorWordRight.editorCursorWordRight))
  Command.register(354, Viewlet.wrapViewletCommand('EditorText', EditorDeleteWordLeft.editorDeleteWordLeft))
  Command.register(355, Viewlet.wrapViewletCommand('EditorText', EditorDeleteWordRight.editorDeleteWordRight))
  Command.register(356, Viewlet.wrapViewletCommand('EditorText', EditorMoveLineUp.editorMoveLineUp))
  Command.register(357, Viewlet.wrapViewletCommand('EditorText', EditorTabCompletion.editorTabCompletion))
  Command.register(358, Viewlet.wrapViewletCommand('EditorText', EditorCursorHome.editorCursorsHome))
  Command.register(359, Viewlet.wrapViewletCommand('EditorText', EditorCursorEnd.editorCursorEnd))
  Command.register(360, Viewlet.wrapViewletCommand('EditorText', EditorHandleSingleClick.editorHandleSingleClick))
  Command.register(361, Viewlet.wrapViewletCommand('EditorText', EditorSelectWord.editorSelectWord))
  Command.register(362, Viewlet.wrapViewletCommand('EditorText', EditorToggleBlockComment.editorToggleBlockComment))
  Command.register(363, Viewlet.wrapViewletCommand('EditorText', EditorMoveSelection.editorMoveSelection))
  Command.register(364, Viewlet.wrapViewletCommand('EditorText', EditorCut.editorCut))
  Command.register(365, Viewlet.wrapViewletCommand('EditorText', EditorCopy.editorCopy))
  Command.register(366, Viewlet.wrapViewletCommand('EditorText', EditorSelectAll.editorSelectAll))
  Command.register(367, Viewlet.wrapViewletCommand('EditorText', EditorMoveRectangleSelection.editorMoveRectangleSelection))
  Command.register(368, Viewlet.wrapViewletCommand('EditorText', EditorCursorWordPartRight.editorCursorWordPartRight))
  Command.register(369, Viewlet.wrapViewletCommand('EditorText', EditorCursorWordPartLeft.editorCursorWordPartLeft))
  Command.register(370, Viewlet.wrapViewletCommand('EditorText', EditorBlur.editorBlur)) // TODO needed?
  Command.register(373, Viewlet.wrapViewletCommand('EditorText', EditorToggleComment.editorToggleComment))
  Command.register(374, Viewlet.wrapViewletCommand('EditorText', EditorDeleteAllLeft.editorDeleteAllLeft))
  Command.register(375, Viewlet.wrapViewletCommand('EditorText', EditorDeleteAllRight.editorDeleteAllRight))
  Command.register(376, Viewlet.wrapViewletCommand('EditorText', EditorHandleTripleClick.editorHandleTripleClick))
  Command.register(377, Viewlet.wrapViewletCommand('EditorText', EditorSelectLine.editorSelectLine))
  Command.register(378, Viewlet.wrapViewletCommand('EditorText', EditorSave.editorSave))
  Command.register(379, Viewlet.wrapViewletCommand('EditorText', EditorHandleContextMenu.editorHandleContextMenu))
  Command.register(380, Viewlet.wrapViewletCommand('EditorText', EditorSelectCharacterLeft.editorSelectCharacterLeft))
  Command.register(381, Viewlet.wrapViewletCommand('EditorText', EditorSelectCharacterRight.editorSelectCharacterRight))
  Command.register(382, Viewlet.wrapViewletCommand('EditorText', EditorPasteText.editorPasteText))
  Command.register(383, Viewlet.wrapViewletCommand('EditorText', EditorPaste.editorPaste))
  Command.register(384, Viewlet.wrapViewletCommand('EditorText', EditorSetDeltaY.editorSetDeltaY))
  Command.register(385, Viewlet.wrapViewletCommand('EditorText', EditorHandleDoubleClick.editorHandleDoubleClick))
  Command.register(386, Viewlet.wrapViewletCommand('EditorText', EditorMoveSelectionPx.editorMoveSelectionPx))
  Command.register(387, Viewlet.wrapViewletCommand('EditorText', EditorMoveRectangleSelectionPx.editorMoveRectangleSelectionPx))
  Command.register(388, Viewlet.wrapViewletCommand('EditorText', EditorFormat.editorFormat))
  Command.register(389, Viewlet.wrapViewletCommand('EditorText', EditorHandleMouseMove.editorHandleMouseMove))
  Command.register(390, Viewlet.wrapViewletCommand('EditorText', EditorSelectNextOccurrence.editorSelectNextOccurrence))
  Command.register(391, Viewlet.wrapViewletCommand('EditorText', EditorSelectAllOccurrences.editorSelectAllOccurrences))
  Command.register(392, Viewlet.wrapViewletCommand('EditorText', EditorHandleTab.editorHandleTab))
  Command.register(393, Viewlet.wrapViewletCommand('EditorText', EditorCancelSelection.editorCancelSelection))
  Command.register(394, Viewlet.wrapViewletCommand('EditorText', EditorUnindent.editorUnindent))
  Command.register(395, Viewlet.wrapViewletCommand('EditorText', EditorUndo.editorUndo))
  Command.register(396, Viewlet.wrapViewletCommand('EditorText', EditorCursorSet.editorCursorSet))
  Command.register(397, Viewlet.wrapViewletCommand('EditorText', EditorDeleteWordPartLeft.editorDeleteWordPartLeft))
  Command.register(398, Viewlet.wrapViewletCommand('EditorText', EditorDeleteWordPartRight.editorDeleteWordPartRight))
  Command.register(399, Viewlet.wrapViewletCommand('EditorText', EditorHandleScrollBarMove.editorHandleScrollBarMove))
  Command.register(400, Viewlet.wrapViewletCommand('EditorText', EditorHandleScrollBarClick.editorHandleScrollBarClick))
  Command.register(401, Viewlet.wrapViewletCommand('EditorText', EditorSelectWordRight.editorSelectWordRight))
  Command.register(402, Viewlet.wrapViewletCommand('EditorText', EditorSelectWordLeft.editorSelectWordLeft))
  Command.register(403, Viewlet.wrapViewletCommand('EditorText', EditorSelectInsideString.editorSelectInsideString))
  Command.register(404, Viewlet.wrapViewletCommand('EditorText', EditorHandleTouchStart.editorHandleTouchStart))
  Command.register(405, Viewlet.wrapViewletCommand('EditorText', EditorHandleTouchMove.editorHandleTouchMove))
  Command.register(406, Viewlet.wrapViewletCommand('EditorText', EditorHandleTouchEnd.editorHandleTouchEnd))
  Command.register(407, Viewlet.wrapViewletCommand('EditorText', EditorHandleBeforeInputFromContentEditable.handleBeforeInputFromContentEditable))
  Command.register(408, Viewlet.wrapViewletCommand('EditorText', EditorHandleNativeSelectionChange.editorHandleNativeSelectionChange))
  Command.register(409, Viewlet.wrapViewletCommand('EditorText', EditorCommandIndentMore.editorIndentMore))
  Command.register(410, Viewlet.wrapViewletCommand('EditorText', EditorCommandIndentLess.editorIndentLess))
  Command.register(411, Viewlet.wrapViewletCommand('EditorText', EditorComposition.editorCompositionStart))
  Command.register(412, Viewlet.wrapViewletCommand('EditorText', EditorComposition.editorCompositionUpdate))
  Command.register(413, Viewlet.wrapViewletCommand('EditorText', EditorComposition.editorCompositionEnd))
  Command.register(414, Viewlet.wrapViewletCommand('EditorText', EditorGoToDefinition.editorGoToDefinition))
  Command.register(415, Viewlet.wrapViewletCommand('EditorText', EditorHandleMouseMoveWithAltKey.editorHandleMouseMoveWithAltKey))
  // TODO command to set cursor position
  // TODO command copy line up/down
  // TODO command move line up/down

  Command.register(980, Viewlet.wrapViewletCommand('EditorText', EditorCompletion.open))
  Command.register(981, Viewlet.wrapViewletCommand('EditorText', EditorCompletion.close))
  Command.register(988, Viewlet.wrapViewletCommand('EditorText', EditorCompletion.openFromType))
  Command.register(989, Viewlet.wrapViewletCommand('EditorText', EditorSetLanguageId.setLanguageId))
  Command.register(990, Viewlet.wrapViewletCommand('EditorText', EditorGoToTypeDefinition.editorGoToTypeDefinition))
  Command.register(991, Viewlet.wrapViewletCommand('EditorText', EditorApplyEdit.editorApplyEdit))
  Command.register(992, Viewlet.wrapViewletCommand('EditorText', EditorSetDecorations.setDecorations))
}
