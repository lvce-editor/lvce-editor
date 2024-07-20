import * as CreateEditor from '../CreateEditor/CreateEditor.ts'
import * as AddCursorAbove from '../EditorCommand/EditorCommandAddCursorAbove.ts'
import * as AddCursorBelow from '../EditorCommand/EditorCommandAddCursorBelow.ts'
import * as EditorApplyEdit from '../EditorCommand/EditorCommandApplyEdit.ts'
import * as EditorBraceCompletion from '../EditorCommand/EditorCommandBraceCompletion.ts'
import * as CancelSelection from '../EditorCommand/EditorCommandCancelSelection.ts'
import * as EditorCloseCompletion from '../EditorCommand/EditorCommandCloseCompletion.ts'
import * as Composition from '../EditorCommand/EditorCommandComposition.ts'
import * as Copy from '../EditorCommand/EditorCommandCopy.ts'
import * as Font from '../Font/Font.ts'
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
import * as GetWordAt from '../EditorCommand/EditorCommandGetWordAt.ts'
import * as EditorGoToDefinition from '../EditorCommand/EditorCommandGoToDefinition.ts'
import * as EditorGoToTypeDefinition from '../EditorCommand/EditorCommandGoToTypeDefinition.ts'
import * as ContextMenu from '../EditorCommand/EditorCommandHandleContextMenu.ts'
import * as EditorCommandHandleContextMenu from '../EditorCommand/EditorCommandHandleContextMenu.ts'
import * as HandleDoubleClick from '../EditorCommand/EditorCommandHandleDoubleClick.ts'
import * as HandleFocus from '../EditorCommand/EditorCommandHandleFocus.ts'
import * as HandleMouseDown from '../EditorCommand/EditorCommandHandleMouseDown.ts'
import * as HandleMouseMove from '../EditorCommand/EditorCommandHandleMouseMove.ts'
import * as EditorCommandHandleMouseMoveWithAltKey from '../EditorCommand/EditorCommandHandleMouseMoveWithAltKey.ts'
import * as EditorCommandHandleNativeBeforeInputFromContentEditable from '../EditorCommand/EditorCommandHandleNativeBeforeInputFromContentEditable.ts'
import * as HandleNativeSelectionChange from '../EditorCommand/EditorCommandHandleNativeSelectionChange.ts'
import * as HandlePointerCaptureLost from '../EditorCommand/EditorCommandHandlePointerCaptureLost.ts'
import * as HandleScrollBarHorizontalMove from '../EditorCommand/EditorCommandHandleScrollBarHorizontalMove.ts'
import * as HandleScrollBarHorizontalPointerDown from '../EditorCommand/EditorCommandHandleScrollBarHorizontalPointerDown.ts'
import * as EditorCommandHandleScrollBarMove from '../EditorCommand/EditorCommandHandleScrollBarMove.ts'
import * as HandleScrollBarMove from '../EditorCommand/EditorCommandHandleScrollBarMove.ts'
import * as HandleScrollBarPointerDown from '../EditorCommand/EditorCommandHandleScrollBarPointerDown.ts'
import * as HandleSingleClick from '../EditorCommand/EditorCommandHandleSingleClick.ts'
import * as HandleTouchEnd from '../EditorCommand/EditorCommandHandleTouchEnd.ts'
import * as HandleTouchMove from '../EditorCommand/EditorCommandHandleTouchMove.ts'
import * as HandleTouchStart from '../EditorCommand/EditorCommandHandleTouchStart.ts'
import * as HandleTripleClick from '../EditorCommand/EditorCommandHandleTripleClick.ts'
import * as IndentLess from '../EditorCommand/EditorCommandIndentLess.ts'
import * as IndentMore from '../EditorCommand/EditorCommandIndentMore.ts'
import * as InsertLineBreak from '../EditorCommand/EditorCommandInsertLineBreak.ts'
import * as MoveRectangleSelection from '../EditorCommand/EditorCommandMoveRectangleSelection.ts'
import * as MoveRectangleSelectionPx from '../EditorCommand/EditorCommandMoveRectangleSelectionPx.ts'
import * as EditorMoveSelection from '../EditorCommand/EditorCommandMoveSelection.ts'
import * as EditorMoveSelectionPx from '../EditorCommand/EditorCommandMoveSelectionPx.ts'
import * as OpenFind from '../EditorCommand/EditorCommandOpenFind.ts'
import * as OrganizeImports from '../EditorCommand/EditorCommandOrganizeImports.ts'
import * as EditorPaste from '../EditorCommand/EditorCommandPaste.ts'
import * as PasteText from '../EditorCommand/EditorCommandPasteText.ts'
import * as ReplaceRange from '../EditorCommand/EditorCommandReplaceRange.ts'
import * as Save from '../EditorCommand/EditorCommandSave.ts'
import * as SelectAll from '../EditorCommand/EditorCommandSelectAll.ts'
import * as SelectAllLeft from '../EditorCommand/EditorCommandSelectAllLeft.ts'
import * as SelectAllOccurrences from '../EditorCommand/EditorCommandSelectAllOccurrences.ts'
import * as SelectAllRight from '../EditorCommand/EditorCommandSelectAllRight.ts'
import * as SelectCharacterLeft from '../EditorCommand/EditorCommandSelectCharacterLeft.ts'
import * as SelectCharacterRight from '../EditorCommand/EditorCommandSelectCharacterRight.ts'
import * as SelectDown from '../EditorCommand/EditorCommandSelectDown.ts'
import * as EditorSelectInsideString from '../EditorCommand/EditorCommandSelectInsideString.ts'
import * as SelectLine from '../EditorCommand/EditorCommandSelectLine.ts'
import * as SelectNextOccurrence from '../EditorCommand/EditorCommandSelectNextOccurrence.ts'
import * as SelectPreviousOccurrence from '../EditorCommand/EditorCommandSelectPreviousOccurrence.ts'
import * as SelectUp from '../EditorCommand/EditorCommandSelectUp.ts'
import * as SelectWord from '../EditorCommand/EditorCommandSelectWord.ts'
import * as SelectWordLeft from '../EditorCommand/EditorCommandSelectWordLeft.ts'
import * as SelectWordRight from '../EditorCommand/EditorCommandSelectWordRight.ts'
import * as SelectionGrow from '../EditorCommand/EditorCommandSelectionGrow.ts'
import * as SetDecorations from '../EditorCommand/EditorCommandSetDecorations.ts'
import * as SetDelta from '../EditorCommand/EditorCommandSetDelta.ts'
import * as SetLanguageId from '../EditorCommand/EditorCommandSetLanguageId.ts'
import * as SetSelections from '../EditorCommand/EditorCommandSetSelections.ts'
import * as EditorShowHover from '../EditorCommand/EditorCommandShowHover.ts'
import * as EditorShowSourceActions from '../EditorCommand/EditorCommandShowSourceActions.ts'
import * as SortLinesAscending from '../EditorCommand/EditorCommandSortLinesAscending.ts'
import * as EditorTabCompletion from '../EditorCommand/EditorCommandTabCompletion.ts'
import * as EditorToggleBlockComment from '../EditorCommand/EditorCommandToggleBlockComment.ts'
import * as EditorToggleComment from '../EditorCommand/EditorCommandToggleComment.ts'
import * as EditorToggleLineComment from '../EditorCommand/EditorCommandToggleLineComment.ts'
import * as EditorType from '../EditorCommand/EditorCommandType.ts'
import * as EditorTypeWithAutoClosing from '../EditorCommand/EditorCommandTypeWithAutoClosing.ts'
import * as EditorUndo from '../EditorCommand/EditorCommandUndo.ts'
import * as Unindent from '../EditorCommand/EditorCommandUnindent.ts'
import * as HandleBeforeInput from '../HandleBeforeInput/HandleBeforeInput.ts'
import * as MoveLineDown from '../MoveLineDown/MoveLineDown.ts'
import * as MoveLineUp from '../MoveLineUp/MoveLineUp.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

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
  'Editor.create': CreateEditor.createEditor,
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
  'Editor.getWordAt': GetWordAt.getWordAt,
  'Editor.getWordBefore': GetWordAt.getWordBefore,
  'Editor.goToDefinition': EditorGoToDefinition.goToDefinition,
  'Editor.goToTypeDefinition': EditorGoToTypeDefinition.goToTypeDefinition,
  'Editor.handleBeforeInput': HandleBeforeInput.handleBeforeInput,
  'Editor.handleBeforeInputFromContentEditable': EditorCommandHandleNativeBeforeInputFromContentEditable.handleBeforeInputFromContentEditable,
  'Editor.handleContextMenu': EditorCommandHandleContextMenu.handleContextMenu,
  'Editor.handleDoubleClick': HandleDoubleClick.handleDoubleClick,
  'Editor.handleFocus': HandleFocus.handleFocus,
  'Editor.handleMouseDown': HandleMouseDown.handleMouseDown,
  'Editor.handleMouseMove': HandleMouseMove.handleMouseMove,
  'Editor.handleMouseMoveWithAltKey': EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey,
  'Editor.handleNativeSelectionChange': HandleNativeSelectionChange.editorHandleNativeSelectionChange,
  'Editor.handlePointerCaptureLost': HandlePointerCaptureLost.handlePointerCaptureLost,
  'Editor.handleScrollBarClick': HandleScrollBarPointerDown.handleScrollBarPointerDown,
  'Editor.handleScrollBarHorizontalMove': HandleScrollBarHorizontalMove.handleScrollBarHorizontalMove,
  'Editor.handleScrollBarHorizontalPointerDown': HandleScrollBarHorizontalPointerDown.handleScrollBarHorizontalPointerDown,
  'Editor.handleScrollBarMove': HandleScrollBarMove.handleScrollBarMove,
  'Editor.handleScrollBarPointerDown': HandleScrollBarPointerDown.handleScrollBarPointerDown,
  'Editor.handleScrollBarVerticalMove': EditorCommandHandleScrollBarMove.handleScrollBarVerticalPointerMove,
  'Editor.handleScrollBarVerticalPointerDown': HandleScrollBarPointerDown.handleScrollBarPointerDown,
  'Editor.handleScrollBarVerticalPointerMove': EditorCommandHandleScrollBarMove.handleScrollBarVerticalPointerMove,
  'Editor.handleSingleClick': HandleSingleClick.handleSingleClick,
  'Editor.handleTouchEnd': HandleTouchEnd.handleTouchEnd,
  'Editor.handleTouchMove': HandleTouchMove.handleTouchMove,
  'Editor.handleTouchStart': HandleTouchStart.handleTouchStart,
  'Editor.handleTripleClick': HandleTripleClick.handleTripleClick,
  'Editor.indendLess': IndentLess.indentLess,
  'Editor.indentMore': IndentMore.indentMore,
  'Editor.insertLineBreak': InsertLineBreak.insertLineBreak,
  'Editor.moveLineDown': MoveLineDown.moveLineDown,
  'Editor.moveLineUp': MoveLineUp.moveLineUp,
  'Editor.moveRectangleSelection': MoveRectangleSelection.moveRectangleSelection,
  'Editor.moveRectangleSelectionPx': MoveRectangleSelectionPx.moveRectangleSelectionPx,
  'Editor.moveSelection': EditorMoveSelection.editorMoveSelection,
  'Editor.moveSelectionPx': EditorMoveSelectionPx.moveSelectionPx,
  'Editor.offsetAt': TextDocument.offsetAt,
  'Editor.openFind': OpenFind.openFind,
  'Editor.organizeImports': OrganizeImports.organizeImports,
  'Editor.paste': EditorPaste.paste,
  'Editor.pasteText': PasteText.pasteText,
  'Editor.replaceRange': ReplaceRange.replaceRange,
  'Editor.save': Save.save,
  'Editor.selectAll': SelectAll.selectAll,
  'Editor.selectAllLeft': SelectAllLeft.editorSelectAllLeft,
  'Editor.selectAllOccurrences': SelectAllOccurrences.selectAllOccurrences,
  'Editor.selectAllRight': SelectAllRight.editorSelectAllRight,
  'Editor.selectCharacterLeft': SelectCharacterLeft.selectCharacterLeft,
  'Editor.selectCharacterRight': SelectCharacterRight.selectCharacterRight,
  'Editor.selectDown': SelectDown.selectDown,
  'Editor.selectInsideString': EditorSelectInsideString.selectInsideString,
  'Editor.selectionGrow': SelectionGrow.selectionGrow,
  'Editor.selectLine': SelectLine.selectLine,
  'Editor.selectNextOccurrence': SelectNextOccurrence.selectNextOccurrence,
  'Editor.selectPreviousOccurrence': SelectPreviousOccurrence.selectPreviousOccurrence,
  'Editor.selectUp': SelectUp.selectUp,
  'Editor.selectWord': SelectWord.selectWord,
  'Editor.selectWordLeft': SelectWordLeft.selectWordLeft,
  'Editor.selectWordRight': SelectWordRight.selectWordRight,
  'Editor.setDecorations': SetDecorations.setDecorations,
  'Editor.setDelta': SetDelta.setDelta,
  'Editor.setDeltaY': SetDelta.setDeltaY,
  'Editor.setLanguageId': SetLanguageId.setLanguageId,
  'Editor.setSelections': SetSelections.setSelections,
  'Editor.showHover': EditorShowHover.showHover,
  'Editor.showSourceActions': EditorShowSourceActions.showSourceActions,
  'Editor.sortLinesAscending': SortLinesAscending.sortLinesAscending,
  'Editor.tabCompletion': EditorTabCompletion.tabCompletion,
  'Editor.toggleBlockComment': EditorToggleBlockComment.toggleBlockComment,
  'Editor.toggleComment': EditorToggleComment.toggleComment,
  'Editor.toggleLineComment': EditorToggleLineComment.editorToggleLineComment,
  'Editor.type': EditorType.type,
  'Editor.typeWithAutoClosing': EditorTypeWithAutoClosing.typeWithAutoClosing,
  'Editor.undo': EditorUndo.undo,
  'Editor.unIndent': Unindent.editorUnindent,
  'Font.ensure': Font.ensure,
}

const map = Object.create(null)

// TODO only store editor state in editor worker, not in renderer worker also
const wrapCommand =
  (fn: any) =>
  async (editor: any, ...args: any[]) => {
    if (!map[editor.uid]) {
      map[editor.uid] = editor
    }
    const actual = map[editor.uid]
    const newEditor = await fn(actual, ...args)
    map[editor.uid] = newEditor
    return newEditor
  }

const wrapCommands = (commands: any) => {
  for (const [key, value] of Object.entries(commands)) {
    commands[key] = wrapCommand(value)
  }
}

wrapCommands(commandMap)
