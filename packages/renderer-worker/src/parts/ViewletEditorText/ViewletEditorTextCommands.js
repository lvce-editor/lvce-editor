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
  'cursorCharacterLeft',
  'addCursorAbove',
  'addCursorBelow',
  'compositionEnd',
  'compositionStart',
  'compositionUpdate',
  'contextMenu',
  'copy',
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
  'deleteWordLeft',
  'deleteWordPartLeft',
  'deleteWordPartRight',
  'deleteWordRight',
  'handleDoubleClick',
  'handleMouseDown',
  'handleSingleClick',
  'handleTouchEnd',
  'handleTripleClick',
  'indentLess',
  'indentMore',
  'moveLineDown',
  'moveLineUp',
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
  'selectNextOccurrence',
  'selectUp',
  'selectUp',
  'selectWord',
  'selectWordLeft',
  'selectWordRight',
  'sortLinesAscending',
  'paste',
  'undo',
  'format',
  'braceCompletion',
  'closeCompletion',
  'cursorSet',
  'goToDefinition',
  'goToTypeDefinition',
  'handleBeforeInputFromContentEditable',
  'handleContextMenu',
]

export const Commands = {
  // TODO command to set cursor position
  ...wrapEditorCommands(ids),
}

// prettier-ignore
export const LazyCommands = {
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
  handleTouchMove: () => import('../EditorCommand/EditorCommandHandleTouchMove.js'),
  handleTouchStart: () => import('../EditorCommand/EditorCommandHandleTouchStart.js'),
  insertLineBreak: () => import('../EditorCommand/EditorCommandInsertLineBreak.js'),
  moveRectangleSelection: () => import('../EditorCommand/EditorCommandMoveRectangleSelection.js'),
  moveRectangleSelectionPx: () => import('../EditorCommand/EditorCommandMoveRectangleSelectionPx.js'),
  moveSelection: () => import('../EditorCommand/EditorCommandMoveSelection.js'),
  moveSelectionPx: () => import('../EditorCommand/EditorCommandMoveSelectionPx.js'),
  openCompletion: () => import('../EditorCommand/EditorCommandCompletion.js'),
  openFind: () => import('../EditorCommand/EditorCommandOpenFind.js'),
  selectionGrow: () => import('../EditorCommand/EditorCommandSelectionGrow.js'),
  selectInsideString: () => import('../EditorCommand/EditorCommandSelectInsideString.js'),
  selectLine: () => import('../EditorCommand/EditorCommandSelectLine.js'),
  selectNextOccurrence: () => import('../EditorCommand/EditorCommandSelectNextOccurrence.js'),
  setDecorations: () => import('../EditorCommand/EditorCommandSetDecorations.js'),
  setDeltaY: () => import('../EditorCommand/EditorCommandSetDelta.js'),
  setDelta: () => import('../EditorCommand/EditorCommandSetDelta.js'),
  setLanguageId: () => import('../EditorCommand/EditorCommandSetLanguageId.js'),
  setSelections: () => import('../EditorCommand/EditorCommandSetSelections.js'),
  tabCompletion: () => import('../EditorCommand/EditorCommandTabCompletion.js'),
  toggleBlockComment: () => import('../EditorCommand/EditorCommandToggleBlockComment.js'),
  toggleComment: () => import('../EditorCommand/EditorCommandToggleComment.js'),
  type: () => import('../EditorCommand/EditorCommandType.js'),
  unIndent: () => import('../EditorCommand/EditorCommandUnindent.js'),
  replaceRange: () => import('../EditorCommand/EditorCommandReplaceRange.js'),
  showHover: () => import('../EditorCommand/EditorCommandShowHover.js'),
  findAllReferences: () => import('../EditorCommand/EditorCommandFindAllReferences.js'),
  organizeImports: () => import('../EditorCommand/EditorCommandOrganizeImports.js'),
  showSourceActions: () => import('../EditorCommand/EditorCommandShowSourceActions.js'),
}

export const CommandsWithSideEffectsLazy = {
  typeWithAutoClosing: () => import('../EditorCommand/EditorCommandTypeWithAutoClosing.js'),
  handleBlur: () => import('../EditorCommand/EditorCommandBlur.js'),
}
