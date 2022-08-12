import * as EditorBraceCompletion from '../EditorCommand/EditorCommandBraceCompletion.js'
import * as EditorCompletion from '../EditorCommand/EditorCommandCompletion.js'
import * as EditorCut from '../EditorCommand/EditorCommandCut.js'
import * as EditorDeleteAllLeft from '../EditorCommand/EditorCommandDeleteAllLeft.js'
import * as EditorDeleteAllRight from '../EditorCommand/EditorCommandDeleteAllRight.js'
import * as EditorDeleteLeft from '../EditorCommand/EditorCommandDeleteCharacterLeft.js'
import * as EditorDeleteRight from '../EditorCommand/EditorCommandDeleteCharacterRight.js'
import * as EditorDeleteWordLeft from '../EditorCommand/EditorCommandDeleteWordLeft.js'
import * as EditorDeleteWordPartLeft from '../EditorCommand/EditorCommandDeleteWordPartLeft.js'
import * as EditorDeleteWordPartRight from '../EditorCommand/EditorCommandDeleteWordPartRight.js'
import * as EditorDeleteWordRight from '../EditorCommand/EditorCommandDeleteWordRight.js'
import * as EditorFormat from '../EditorCommand/EditorCommandFormat.js'
import * as EditorGoToDefinition from '../EditorCommand/EditorCommandGoToDefinition.js'
import * as EditorGoToTypeDefinition from '../EditorCommand/EditorCommandGoToTypeDefinition.js'
import * as EditorHandleContextMenu from '../EditorCommand/EditorCommandHandleContextMenu.js'
import * as EditorHandleDoubleClick from '../EditorCommand/EditorCommandHandleDoubleClick.js'
import * as EditorHandleMouseMove from '../EditorCommand/EditorCommandHandleMouseMove.js'
import * as EditorHandleMouseMoveWithAltKey from '../EditorCommand/EditorCommandHandleMouseMoveWithAltKey.js'
import * as EditorHandleBeforeInputFromContentEditable from '../EditorCommand/EditorCommandHandleNativeBeforeInputFromContentEditable.js'
import * as EditorHandleNativeSelectionChange from '../EditorCommand/EditorCommandHandleNativeSelectionChange.js'
import * as EditorHandleScrollBarClick from '../EditorCommand/EditorCommandHandleScrollBarClick.js'
import * as EditorHandleScrollBarMove from '../EditorCommand/EditorCommandHandleScrollBarMove.js'
import * as EditorHandleSingleClick from '../EditorCommand/EditorCommandHandleSingleClick.js'
import * as EditorHandleTab from '../EditorCommand/EditorCommandHandleTab.js'
import * as EditorHandleTouchEnd from '../EditorCommand/EditorCommandHandleTouchEnd.js'
import * as EditorHandleTouchMove from '../EditorCommand/EditorCommandHandleTouchMove.js'
import * as EditorHandleTouchStart from '../EditorCommand/EditorCommandHandleTouchStart.js'
import * as EditorHandleTripleClick from '../EditorCommand/EditorCommandHandleTripleClick.js'
import * as EditorCommandIndentLess from '../EditorCommand/EditorCommandIndentLess.js'
import * as EditorCommandIndentMore from '../EditorCommand/EditorCommandIndentMore.js'
import * as EditorInsertLineBreak from '../EditorCommand/EditorCommandInsertLineBreak.js'
import * as EditorMoveLineDown from '../EditorCommand/EditorCommandMoveLineDown.js'
import * as EditorMoveLineUp from '../EditorCommand/EditorCommandMoveLineUp.js'
import * as EditorMoveRectangleSelection from '../EditorCommand/EditorCommandMoveRectangleSelection.js'
import * as EditorMoveRectangleSelectionPx from '../EditorCommand/EditorCommandMoveRectangleSelectionPx.js'
import * as EditorMoveSelection from '../EditorCommand/EditorCommandMoveSelection.js'
import * as EditorMoveSelectionPx from '../EditorCommand/EditorCommandMoveSelectionPx.js'
import * as EditorPaste from '../EditorCommand/EditorCommandPaste.js'
import * as EditorPasteText from '../EditorCommand/EditorCommandPasteText.js'
import * as EditorSave from '../EditorCommand/EditorCommandSave.js'
import * as EditorSelectAll from '../EditorCommand/EditorCommandSelectAll.js'
import * as EditorSelectAllOccurrences from '../EditorCommand/EditorCommandSelectAllOccurrences.js'
import * as EditorSelectCharacterLeft from '../EditorCommand/EditorCommandSelectCharacterLeft.js'
import * as EditorSelectCharacterRight from '../EditorCommand/EditorCommandSelectCharacterRight.js'
import * as EditorSelectInsideString from '../EditorCommand/EditorCommandSelectInsideString.js'
import * as EditorSelectLine from '../EditorCommand/EditorCommandSelectLine.js'
import * as EditorSelectNextOccurrence from '../EditorCommand/EditorCommandSelectNextOccurrence.js'
import * as EditorSelectWord from '../EditorCommand/EditorCommandSelectWord.js'
import * as EditorSelectWordLeft from '../EditorCommand/EditorCommandSelectWordLeft.js'
import * as EditorSelectWordRight from '../EditorCommand/EditorCommandSelectWordRight.js'
import * as EditorSetDecorations from '../EditorCommand/EditorCommandSetDecorations.js'
import * as EditorSetDeltaY from '../EditorCommand/EditorCommandSetDeltaY.js'
import * as EditorSetLanguageId from '../EditorCommand/EditorCommandSetLanguageId.js'
import * as EditorTabCompletion from '../EditorCommand/EditorCommandTabCompletion.js'
import * as EditorToggleBlockComment from '../EditorCommand/EditorCommandToggleBlockComment.js'
import * as EditorToggleComment from '../EditorCommand/EditorCommandToggleComment.js'
import * as EditorType from '../EditorCommand/EditorCommandType.js'
import * as EditorUndo from '../EditorCommand/EditorCommandUndo.js'
import * as EditorUnindent from '../EditorCommand/EditorCommandUnindent.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

const lazyCommand = (importFn, key) => {
  const lazyCommand = async (...args) => {
    const module = await importFn()
    return module[key](...args)
  }
  return Viewlet.wrapViewletCommand('EditorText', lazyCommand)
}

// prettier-ignore
const Imports = {
  ApplyEdit: () => import('../EditorCommand/EditorCommandApplyEdit.js'),
  Blur: () => import('../EditorCommand/EditorCommandBlur.js'),
  CancelSelection: () => import('../EditorCommand/EditorCommandCancelSelection.js'),
  EditorCompletion:()=>import('../EditorCommand/EditorCommandCompletion.js'),
  EditorComposition:()=>import('../EditorCommand/EditorCommandComposition.js'),
  EditorCopy:()=>import('../EditorCommand/EditorCommandCopy.js'),
  CopyLineDown:()=>import('../EditorCommand/EditorCommandCopyLineDown.js'),
  CopyLineUp:()=>import('../EditorCommand/EditorCommandCopyLineUp.js'),
  CursorCharacterLeft:()=>import('../EditorCommand/EditorCommandCursorCharacterLeft.js'),
  CursorCharacterRight:()=>import('../EditorCommand/EditorCommandCursorCharacterRight.js'),
  CursorEnd:()=>import('../EditorCommand/EditorCommandCursorEnd.js'),
  CursorDown:()=>import('../EditorCommand/EditorCommandCursorDown.js'),
  CursorSet:()=>import('../EditorCommand/EditorCommandCursorSet.js'),
  CursorHome:()=>import('../EditorCommand/EditorCommandCursorHome.js'),
  CursorUp:()=>import('../EditorCommand/EditorCommandCursorUp.js'),
  CursorWordLeft:()=>import('../EditorCommand/EditorCommandCursorWordLeft.js'),
  CursorWordPartLeft:()=>import('../EditorCommand/EditorCommandCursorWordPartLeft.js'),
  CursorWordRight:()=>import('../EditorCommand/EditorCommandCursorWordRight.js'),
  CursorWordPartRight:()=>import('../EditorCommand/EditorCommandCursorWordPartRight.js'),
  Cut:()=>import('../EditorCommand/EditorCommandCut.js'),
  DeleteAllLeft:()=>import('../EditorCommand/EditorCommandDeleteAllLeft.js'),
  DeleteAllRight:()=>import('../EditorCommand/EditorCommandDeleteAllRight.js'),
  DeleteLeft:()=>import('../EditorCommand/EditorCommandDeleteCharacterLeft.js'),
  DeleteRight:()=>import('../EditorCommand/EditorCommandDeleteCharacterRight.js'),
  DeleteWordLeft:()=>import('../EditorCommand/EditorCommandDeleteWordLeft.js'),
  DeleteWordPartLeft:()=>import('../EditorCommand/EditorCommandDeleteWordPartLeft.js'),
  DeleteWordRight:()=>import('../EditorCommand/EditorCommandDeleteWordRight.js'),
  DeleteWordPartRight:()=>import('../EditorCommand/EditorCommandDeleteWordPartRight.js'),
  Format:()=>import('../EditorCommand/EditorCommandFormat.js'),
  GoToDefinition:()=>import('../EditorCommand/EditorCommandGoToDefinition.js'),
}

// prettier-ignore
export const Commands = {
  'Editor.applyEdit': lazyCommand(Imports.ApplyEdit, 'editorApplyEdit'),
  'Editor.blur': lazyCommand(Imports.Blur, 'editorBlur'), // TODO needed?
  'Editor.cancelSelection': lazyCommand(Imports.CancelSelection, 'editorCancelSelection'),
  'Editor.close': lazyCommand(Imports.EditorCompletion, 'close'),
  'Editor.compositionEnd': lazyCommand(Imports.EditorComposition,'editorCompositionEnd'),
  'Editor.compositionStart': lazyCommand(Imports.EditorComposition,'editorCompositionStart'),
  'Editor.compositionUpdate': lazyCommand(Imports.EditorComposition,'editorCompositionUpdate'),
  'Editor.copy': lazyCommand(Imports.EditorCopy, 'editorCopy'),
  'Editor.copyLineDown': lazyCommand(Imports.CopyLineDown, 'editorCopyLineDown'),
  'Editor.copyLineUp': lazyCommand(Imports.CopyLineUp, 'editorCopyLineUp'),
  'Editor.cursorCharacterLeft': lazyCommand(Imports.CursorCharacterLeft, 'editorCursorCharacterLeft'),
  'Editor.cursorLeft': lazyCommand(Imports.CursorCharacterLeft, 'editorCursorCharacterLeft'),
  'Editor.cursorRight': lazyCommand(Imports.CursorCharacterRight, 'editorCursorCharacterRight'),
  'Editor.cursorCharacterRight': lazyCommand(Imports.CursorCharacterRight, 'editorCursorCharacterRight'),
  'Editor.cursorEnd': lazyCommand(Imports.CursorEnd, 'editorCursorEnd'),
  'Editor.cursorDown': lazyCommand(Imports.CursorDown, 'editorCursorDown'),
  'Editor.cursorSet': lazyCommand(Imports.CursorSet, 'editorCursorSet') ,
  'Editor.cursorHome': lazyCommand(Imports.CursorHome, 'editorCursorsHome'),
  'Editor.cursorUp': lazyCommand(Imports.CursorUp, 'editorCursorsUp'),
  'Editor.cursorWordLeft': lazyCommand(Imports.CursorWordLeft, 'editorCursorWordLeft'),
  'Editor.cursorWordPartLeft': lazyCommand(Imports.CursorWordPartLeft,'editorCursorWordPartLeft'),
  'Editor.cursorWordPartRight': lazyCommand(Imports.CursorWordPartRight, 'editorCursorWordPartRight'),
  'Editor.cursorWordRight': lazyCommand(Imports.CursorWordRight, 'editorCursorWordRight'),
  'Editor.cut': lazyCommand(Imports.Cut, 'editorCut'),
  'Editor.deleteAllLeft': lazyCommand(Imports.DeleteAllLeft, 'editorDeleteAllLeft'),
  'Editor.deleteAllRight': lazyCommand(Imports.DeleteAllRight, 'editorDeleteAllRight'),
  'Editor.deleteLeft': lazyCommand(Imports.DeleteLeft, 'editorDeleteCharacterLeft'),
  'Editor.deleteRight': lazyCommand(Imports.DeleteRight, 'editorDeleteCharacterRight'),
  'Editor.deleteWordLeft': lazyCommand(Imports.DeleteWordLeft, 'editorDeleteWordLeft'),
  'Editor.deleteWordPartLeft': lazyCommand(Imports.DeleteWordPartLeft, 'editorDeleteWordPartLeft'),
  'Editor.deleteWordPartRight':lazyCommand(Imports.DeleteWordPartRight, 'editorDeleteWordPartRight'),
  'Editor.deleteWordRight': lazyCommand(Imports.DeleteWordRight, 'editorDeleteWordRight'),
  'Editor.format': lazyCommand(Imports.Format, 'editorFormat'),
  'Editor.goToDefinition': lazyCommand(Imports.GoToDefinition, 'editorGoToDefinition'),
  'Editor.goToTypeDefinition': Viewlet.wrapViewletCommand('EditorText', EditorGoToTypeDefinition.editorGoToTypeDefinition),
  'Editor.handleBeforeInputFromContentEditable': Viewlet.wrapViewletCommand('EditorText', EditorHandleBeforeInputFromContentEditable.handleBeforeInputFromContentEditable),
  'Editor.handleContextMenu': Viewlet.wrapViewletCommand('EditorText', EditorHandleContextMenu.editorHandleContextMenu),
  'Editor.handleDoubleClick': Viewlet.wrapViewletCommand('EditorText', EditorHandleDoubleClick.editorHandleDoubleClick),
  'Editor.handleMouseMove': Viewlet.wrapViewletCommand('EditorText', EditorHandleMouseMove.editorHandleMouseMove),
  'Editor.handleMouseMoveWithAltKey': Viewlet.wrapViewletCommand('EditorText', EditorHandleMouseMoveWithAltKey.editorHandleMouseMoveWithAltKey),
  'Editor.handleNativeSelectionChange': Viewlet.wrapViewletCommand('EditorText', EditorHandleNativeSelectionChange.editorHandleNativeSelectionChange),
  'Editor.handleScrollBarClick': Viewlet.wrapViewletCommand('EditorText', EditorHandleScrollBarClick.editorHandleScrollBarClick),
  'Editor.handleScrollBarMove': Viewlet.wrapViewletCommand('EditorText', EditorHandleScrollBarMove.editorHandleScrollBarMove),
  'Editor.handleSingleClick': Viewlet.wrapViewletCommand('EditorText', EditorHandleSingleClick.editorHandleSingleClick),
  'Editor.handleTab': Viewlet.wrapViewletCommand('EditorText', EditorHandleTab.editorHandleTab),
  'Editor.handleTouchEnd': Viewlet.wrapViewletCommand('EditorText', EditorHandleTouchEnd.editorHandleTouchEnd),
  'Editor.handleTouchMove': Viewlet.wrapViewletCommand('EditorText', EditorHandleTouchMove.editorHandleTouchMove),
  'Editor.handleTouchStart': Viewlet.wrapViewletCommand('EditorText', EditorHandleTouchStart.editorHandleTouchStart),
  'Editor.handleTripleClick': Viewlet.wrapViewletCommand('EditorText', EditorHandleTripleClick.editorHandleTripleClick),
  'Editor.indentLess': Viewlet.wrapViewletCommand('EditorText', EditorCommandIndentLess.editorIndentLess),
  'Editor.indentMore': Viewlet.wrapViewletCommand('EditorText', EditorCommandIndentMore.editorIndentMore),
  'Editor.insertLineBreak': Viewlet.wrapViewletCommand('EditorText', EditorInsertLineBreak.editorInsertLineBreak),
  'Editor.moveLineDown': Viewlet.wrapViewletCommand('EditorText', EditorMoveLineDown.editorMoveLineDown),
  'Editor.moveLineUp': Viewlet.wrapViewletCommand('EditorText', EditorMoveLineUp.editorMoveLineUp),
  'Editor.moveRectangleSelection': Viewlet.wrapViewletCommand('EditorText', EditorMoveRectangleSelection.editorMoveRectangleSelection),
  'Editor.moveRectangleSelectionPx': Viewlet.wrapViewletCommand('EditorText', EditorMoveRectangleSelectionPx.editorMoveRectangleSelectionPx),
  'Editor.moveSelection': Viewlet.wrapViewletCommand('EditorText', EditorMoveSelection.editorMoveSelection),
  'Editor.moveSelectionPx': Viewlet.wrapViewletCommand('EditorText', EditorMoveSelectionPx.editorMoveSelectionPx),
  'Editor.openCompletion': Viewlet.wrapViewletCommand('EditorText', EditorCompletion.open),
  'Editor.openCompletionFromType': Viewlet.wrapViewletCommand('EditorText', EditorCompletion.openFromType),
  'Editor.paste': Viewlet.wrapViewletCommand('EditorText', EditorPaste.editorPaste),
  'Editor.pasteText': Viewlet.wrapViewletCommand('EditorText', EditorPasteText.editorPasteText),
  'Editor.save': Viewlet.wrapViewletCommand('EditorText', EditorSave.editorSave),
  'Editor.selectAll': Viewlet.wrapViewletCommand('EditorText', EditorSelectAll.editorSelectAll),
  'Editor.selectAllOccurrences': Viewlet.wrapViewletCommand('EditorText', EditorSelectAllOccurrences.editorSelectAllOccurrences),
  'Editor.selectCharacterLeft': Viewlet.wrapViewletCommand('EditorText', EditorSelectCharacterLeft.editorSelectCharacterLeft),
  'Editor.selectCharacterRight': Viewlet.wrapViewletCommand('EditorText', EditorSelectCharacterRight.editorSelectCharacterRight),
  'Editor.selectInsideString': Viewlet.wrapViewletCommand('EditorText', EditorSelectInsideString.editorSelectInsideString),
  'Editor.selectLine': Viewlet.wrapViewletCommand('EditorText', EditorSelectLine.editorSelectLine),
  'Editor.selectNextOccurrence': Viewlet.wrapViewletCommand('EditorText', EditorSelectNextOccurrence.editorSelectNextOccurrence),
  'Editor.selectWord': Viewlet.wrapViewletCommand('EditorText', EditorSelectWord.editorSelectWord),
  'Editor.selectWordLeft': Viewlet.wrapViewletCommand('EditorText', EditorSelectWordLeft.editorSelectWordLeft),
  'Editor.selectWordRight': Viewlet.wrapViewletCommand('EditorText', EditorSelectWordRight.editorSelectWordRight),
  'Editor.setDecorations': Viewlet.wrapViewletCommand('EditorText', EditorSetDecorations.setDecorations),
  'Editor.setDeltaY': Viewlet.wrapViewletCommand('EditorText', EditorSetDeltaY.editorSetDeltaY),
  'Editor.setLanguageId': Viewlet.wrapViewletCommand('EditorText', EditorSetLanguageId.setLanguageId),
  'Editor.tabCompletion': Viewlet.wrapViewletCommand('EditorText', EditorTabCompletion.editorTabCompletion),
  'Editor.toggleBlockComment': Viewlet.wrapViewletCommand('EditorText', EditorToggleBlockComment.editorToggleBlockComment),
  'Editor.toggleComment': Viewlet.wrapViewletCommand('EditorText', EditorToggleComment.editorToggleComment),
  'Editor.type': Viewlet.wrapViewletCommand('EditorText', EditorType.editorType),
  'Editor.undo': Viewlet.wrapViewletCommand('EditorText', EditorUndo.editorUndo),
  'Editor.unindent': Viewlet.wrapViewletCommand('EditorText', EditorUnindent.editorUnindent),
  'Editor.braceCompletion': Viewlet.wrapViewletCommand('EditorText', EditorBraceCompletion.editorBraceCompletion),
    // TODO command to set cursor position
  // TODO command copy line up/down
  // TODO command move line up/down
}

export * from './ViewletEditorText.js'
