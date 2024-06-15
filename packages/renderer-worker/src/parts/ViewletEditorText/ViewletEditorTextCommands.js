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
  'addCursorAbove',
  'addCursorBelow',
  'compositionEnd',
  'compositionStart',
  'compositionUpdate',
  'contextMenu',
  'copy',
  'copyLineDown',
  'copyLineUp',
  'cursorCharacterLeft',
  'cursorCharacterRight',
  'cursorDown',
  'cursorEnd',
  'cursorHome',
  'cursorLeft',
  'cursorRight',
  'cursorUp',
  'cursorWordLeft',
  'cursorWordPartLeft',
  'cursorWordPartRight',
  'cursorWordRight',
  'cut',
  'deleteAllLeft',
  'deleteAllRight',
  'deleteCharacterLeft',
  'deleteCharacterRight',
  'deleteHorizontalRight',
  'deleteLeft',
  'deleteRight',
  'deleteWordLeft',
  'deleteWordPartLeft',
  'deleteWordPartRight',
  'deleteWordRight',
  'findAllReferences',
  'handleDoubleClick',
  'handleMouseDown',
  'handleScrollBarClick',
  'handleScrollBarMove',
  'handleScrollBarPointerDown',
  'handleScrollBarVerticalPointerDown',
  'handleSingleClick',
  'handleTouchEnd',
  'handleTripleClick',
  'indentLess',
  'indentMore',
  'insertLineBreak',
  'moveLineDown',
  'moveLineUp',
  'paste',
  'pasteText',
  'save',
  'selectAll',
  'selectAllLeft',
  'selectAllOccurrences',
  'selectAllRight',
  'selectCharacterLeft',
  'selectCharacterRight',
  'selectDown',
  'selectDown',
  'selectLine',
  'selectNextOccurrence',
  'selectUp',
  'selectUp',
  'selectWord',
  'selectWordLeft',
  'selectWordRight',
  'sortLinesAscending',
  'toggleBlockComment',
  'toggleComment',
  'toggleLineComment',
  'undo',
]

export const Commands = {
  // TODO command to set cursor position
  ...wrapEditorCommands(ids),
}

// prettier-ignore
export const LazyCommands = {
  applyEdit: () => import('../EditorCommand/EditorCommandApplyEdit.js'),
  braceCompletion: () => import('../EditorCommand/EditorCommandBraceCompletion.js'),
  closeCompletion: () => import('../EditorCommand/EditorCommandCloseCompletion.js'),
  cursorSet: () => import('../EditorCommand/EditorCommandCursorSet.js'),
  format: () => import('../EditorCommand/EditorCommandFormat.js'),
  goToDefinition: () => import('../EditorCommand/EditorCommandGoToDefinition.js'),
  goToTypeDefinition: () => import('../EditorCommand/EditorCommandGoToTypeDefinition.js'),
  handleBeforeInputFromContentEditable: () => import('../EditorCommand/EditorCommandHandleNativeBeforeInputFromContentEditable.js'),
  handleContextMenu: () => import('../EditorCommand/EditorCommandHandleContextMenu.js'),
  handleFocus: () => import('../EditorCommand/EditorCommandHandleFocus.js'),
  handleMouseMove: () => import('../EditorCommand/EditorCommandHandleMouseMove.js'),
  handleMouseMoveWithAltKey: () => import('../EditorCommand/EditorCommandHandleMouseMoveWithAltKey.js'),
  handleNativeSelectionChange: () => import('../EditorCommand/EditorCommandHandleNativeSelectionChange.js'),
  handleScrollBarHorizontalMove: () => import('../EditorCommand/EditorCommandHandleScrollBarHorizontalMove.js'),
  handleScrollBarHorizontalPointerDown: () => import('../EditorCommand/EditorCommandHandleScrollBarHorizontalPointerDown.js'),
  handleTab: () => import('../EditorCommand/EditorCommandHandleTab.js'),
  handleTouchMove: () => import('../EditorCommand/EditorCommandHandleTouchMove.js'),
  handleTouchStart: () => import('../EditorCommand/EditorCommandHandleTouchStart.js'),
  moveRectangleSelection: () => import('../EditorCommand/EditorCommandMoveRectangleSelection.js'),
  moveRectangleSelectionPx: () => import('../EditorCommand/EditorCommandMoveRectangleSelectionPx.js'),
  moveSelection: () => import('../EditorCommand/EditorCommandMoveSelection.js'),
  moveSelectionPx: () => import('../EditorCommand/EditorCommandMoveSelectionPx.js'),
  openCompletion: () => import('../EditorCommand/EditorCommandCompletion.js'),
  openFind: () => import('../EditorCommand/EditorCommandOpenFind.js'),
  selectionGrow: () => import('../EditorCommand/EditorCommandSelectionGrow.js'),
  selectInsideString: () => import('../EditorCommand/EditorCommandSelectInsideString.js'),
  selectNextOccurrence: () => import('../EditorCommand/EditorCommandSelectNextOccurrence.js'),
  setDecorations: () => import('../EditorCommand/EditorCommandSetDecorations.js'),
  setDeltaY: () => import('../EditorCommand/EditorCommandSetDelta.js'),
  setDelta: () => import('../EditorCommand/EditorCommandSetDelta.js'),
  setLanguageId: () => import('../EditorCommand/EditorCommandSetLanguageId.js'),
  setSelections: () => import('../EditorCommand/EditorCommandSetSelections.js'),
  tabCompletion: () => import('../EditorCommand/EditorCommandTabCompletion.js'),
  type: () => import('../EditorCommand/EditorCommandType.js'),
  unIndent: () => import('../EditorCommand/EditorCommandUnindent.js'),
  replaceRange: () => import('../EditorCommand/EditorCommandReplaceRange.js'),
  showHover: () => import('../EditorCommand/EditorCommandShowHover.js'),
  organizeImports: () => import('../EditorCommand/EditorCommandOrganizeImports.js'),
  showSourceActions: () => import('../EditorCommand/EditorCommandShowSourceActions.js'),
}

export const CommandsWithSideEffectsLazy = {
  typeWithAutoClosing: () => import('../EditorCommand/EditorCommandTypeWithAutoClosing.js'),
  handleBlur: () => import('../EditorCommand/EditorCommandBlur.js'),
}
