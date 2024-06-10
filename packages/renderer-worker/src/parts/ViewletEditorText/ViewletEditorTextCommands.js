import * as EditorWorker from '../EditorWorker/EditorWorker.js'

// prettier-ignore

const wrapEditorCommand = (id) => {
  return (...args) => {
    if (args.length === 0) {
      throw new Error('missing arg')
    }
    return EditorWorker.invoke(`Editor.${id}`, ...args)
  }
}

const wrapEditorCommands = (ids) => {
  let all = {}
  for (const id of ids) {
    all = { ...all, [id]: wrapEditorCommand(id) }
  }
  return all
}

const ids = [
  'copyLineDown',
  'copyLineUp',
  'cursorLeft',
  'cursorRight',
  'cursorCharacterLeft',
  'cursorCharacterRight',
  'cursorDown',
  'cursorEnd',
  'cursorHome',
  'cursorUp',
  'cursorWordLeft',
  'cursorWordPartLeft',
  'cursorWordPartRight',
  'cursorWordRight',
  'deleteAllLeft',
  'deleteAllRight',
  'deleteCharacterLeft',
  'deleteCharacterRight',
  'deleteHorizontalRight',
  'deleteWordLeft',
  'deleteWordPartLeft',
  'deleteWordPartRight',
  'deleteWordRight',
  'selectAll',
  'selectAllLeft',
  'selectAllRight',
  'selectCharacterLeft',
  'selectCharacterRight',
  'selectUp',
  'selectDown',
  'selectWordLeft',
  'selectWordRight',
  'selectNextOccurrence',
  'selectAllOccurrences',
  'moveLineUp',
  'moveLineDown',
  'copyLineDown',
  'copyLineUp',
  'indentLess',
  'indentMore',
]

export const Commands = {
  // TODO command to set cursor position
  ...wrapEditorCommands(ids),
}

// prettier-ignore
export const LazyCommands = {
  addCursorAbove: () => import('../EditorCommand/EditorCommandAddCursorAbove.js'),
  addCursorBelow: () => import('../EditorCommand/EditorCommandAddCursorBelow.js'),
  applyEdit: () => import('../EditorCommand/EditorCommandApplyEdit.js'),
  braceCompletion: () => import('../EditorCommand/EditorCommandBraceCompletion.js'),
  cancelSelection: () => import('../EditorCommand/EditorCommandCancelSelection.js'),
  closeCompletion: () => import('../EditorCommand/EditorCommandCloseCompletion.js'),
  compositionEnd: () => import('../EditorCommand/EditorCommandComposition.js'),
  compositionStart: () => import('../EditorCommand/EditorCommandComposition.js'),
  compositionUpdate: () => import('../EditorCommand/EditorCommandComposition.js'),
  contextMenu: () => import('../EditorCommand/EditorCommandHandleContextMenu.js'),
  copy: () => import('../EditorCommand/EditorCommandCopy.js'),
  cursorSet: () => import('../EditorCommand/EditorCommandCursorSet.js'),
  cut: () => import('../EditorCommand/EditorCommandCut.js'),
  format: () => import('../EditorCommand/EditorCommandFormat.js'),
  goToDefinition: () => import('../EditorCommand/EditorCommandGoToDefinition.js'),
  goToTypeDefinition: () => import('../EditorCommand/EditorCommandGoToTypeDefinition.js'),
  handleBeforeInputFromContentEditable: () => import('../EditorCommand/EditorCommandHandleNativeBeforeInputFromContentEditable.js'),
  handleContextMenu: () => import('../EditorCommand/EditorCommandHandleContextMenu.js'),
  handleFocus: () => import('../EditorCommand/EditorCommandHandleFocus.js'),
  handleMouseMove: () => import('../EditorCommand/EditorCommandHandleMouseMove.js'),
  handleMouseMoveWithAltKey: () => import('../EditorCommand/EditorCommandHandleMouseMoveWithAltKey.js'),
  handleNativeSelectionChange: () => import('../EditorCommand/EditorCommandHandleNativeSelectionChange.js'),
  handlePointerCaptureLost: () => import('../EditorCommand/EditorCommandHandlePointerCaptureLost.js'),
  handleScrollBarClick: () => import('../EditorCommand/EditorCommandHandleScrollBarPointerDown.js'),
  handleScrollBarHorizontalMove: () => import('../EditorCommand/EditorCommandHandleScrollBarHorizontalMove.js'),
  handleScrollBarHorizontalPointerDown: () => import('../EditorCommand/EditorCommandHandleScrollBarHorizontalPointerDown.js'),
  handleScrollBarMove: () => import('../EditorCommand/EditorCommandHandleScrollBarMove.js'),
  handleScrollBarVerticalPointerMove: () => import('../EditorCommand/EditorCommandHandleScrollBarMove.js'),
  handleScrollBarPointerDown: () => import('../EditorCommand/EditorCommandHandleScrollBarPointerDown.js'),
  handleScrollBarVerticalPointerDown: () => import('../EditorCommand/EditorCommandHandleScrollBarPointerDown.js'),
  handleTab: () => import('../EditorCommand/EditorCommandHandleTab.js'),
  handleTouchEnd: () => import('../EditorCommand/EditorCommandHandleTouchEnd.js'),
  handleTouchMove: () => import('../EditorCommand/EditorCommandHandleTouchMove.js'),
  handleTouchStart: () => import('../EditorCommand/EditorCommandHandleTouchStart.js'),
  insertLineBreak: () => import('../EditorCommand/EditorCommandInsertLineBreak.js'),
  moveRectangleSelection: () => import('../EditorCommand/EditorCommandMoveRectangleSelection.js'),
  moveRectangleSelectionPx: () => import('../EditorCommand/EditorCommandMoveRectangleSelectionPx.js'),
  moveSelection: () => import('../EditorCommand/EditorCommandMoveSelection.js'),
  moveSelectionPx: () => import('../EditorCommand/EditorCommandMoveSelectionPx.js'),
  openCompletion: () => import('../EditorCommand/EditorCommandCompletion.js'),
  openFind: () => import('../EditorCommand/EditorCommandOpenFind.js'),
  paste: () => import('../EditorCommand/EditorCommandPaste.js'),
  pasteText: () => import('../EditorCommand/EditorCommandPasteText.js'),
  save: () => import('../EditorCommand/EditorCommandSave.js'),
  selectionGrow: () => import('../EditorCommand/EditorCommandSelectionGrow.js'),
  selectDown: () => import('../EditorCommand/EditorCommandSelectDown.js'),
  selectInsideString: () => import('../EditorCommand/EditorCommandSelectInsideString.js'),
  selectLine: () => import('../EditorCommand/EditorCommandSelectLine.js'),
  selectNextOccurrence: () => import('../EditorCommand/EditorCommandSelectNextOccurrence.js'),
  selectUp: () => import('../EditorCommand/EditorCommandSelectUp.js'),
  selectWord: () => import('../EditorCommand/EditorCommandSelectWord.js'),
  setDecorations: () => import('../EditorCommand/EditorCommandSetDecorations.js'),
  setDeltaY: () => import('../EditorCommand/EditorCommandSetDelta.js'),
  setDelta: () => import('../EditorCommand/EditorCommandSetDelta.js'),
  setLanguageId: () => import('../EditorCommand/EditorCommandSetLanguageId.js'),
  setSelections: () => import('../EditorCommand/EditorCommandSetSelections.js'),
  sortLinesAscending: () => import('../EditorCommand/EditorCommandSortLinesAscending.js'),
  tabCompletion: () => import('../EditorCommand/EditorCommandTabCompletion.js'),
  toggleBlockComment: () => import('../EditorCommand/EditorCommandToggleBlockComment.js'),
  toggleComment: () => import('../EditorCommand/EditorCommandToggleComment.js'),
  type: () => import('../EditorCommand/EditorCommandType.js'),
  undo: () => import('../EditorCommand/EditorCommandUndo.js'),
  unIndent: () => import('../EditorCommand/EditorCommandUnindent.js'),
  replaceRange: () => import('../EditorCommand/EditorCommandReplaceRange.js'),
  showHover: () => import('../EditorCommand/EditorCommandShowHover.js'),
  findAllReferences: () => import('../EditorCommand/EditorCommandFindAllReferences.js'),
  organizeImports: () => import('../EditorCommand/EditorCommandOrganizeImports.js'),
  showSourceActions: () => import('../EditorCommand/EditorCommandShowSourceActions.js'),
}

export const CommandsWithSideEffectsLazy = {
  typeWithAutoClosing: () => import('../EditorCommand/EditorCommandTypeWithAutoClosing.js'),
  handleSingleClick: () => import('../EditorCommand/EditorCommandHandleSingleClick.js'),
  deleteWordLeft: () => import('../EditorCommand/EditorCommandDeleteWordLeft.js'),
  deleteWordPartLeft: () => import('../EditorCommand/EditorCommandDeleteWordPartLeft.js'),
  handleBlur: () => import('../EditorCommand/EditorCommandBlur.js'),
  deleteLeft: () => import('../EditorCommand/EditorCommandDeleteCharacterLeft.js'),
  handleDoubleClick: () => import('../EditorCommand/EditorCommandHandleDoubleClick.js'),
  handleMouseDown: () => import('../EditorCommand/EditorCommandHandleMouseDown.js'),
  handleTripleClick: () => import('../EditorCommand/EditorCommandHandleTripleClick.js'),
}
