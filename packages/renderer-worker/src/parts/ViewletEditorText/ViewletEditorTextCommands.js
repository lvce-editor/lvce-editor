import * as EditorWorker from '../EditorWorker/EditorWorker.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

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
  'goToDefinition',
  'goToTypeDefinition',
  'handleDoubleClick',
  'handleMouseDown',
  'handleMouseMove',
  'handleMouseMoveWithAltKey',
  'handlePointerCaptureLost',
  'handleScrollBarClick',
  'handleScrollBarHorizontalMove',
  'handleScrollBarHorizontalPointerDown',
  'handleScrollBarMove',
  'handleScrollBarPointerDown',
  'handleScrollBarVerticalPointerDown',
  'handleSingleClick',
  'handleTouchEnd',
  'handleTouchMove',
  'handleTouchStart',
  'handleTripleClick',
  'indentLess',
  'indentMore',
  'insertLineBreak',
  'moveLineDown',
  'moveLineUp',
  'moveRectangleSelection',
  'moveRectangleSelectionPx',
  'moveSelection',
  'moveSelectionPx',
  'openFind',
  'organizeImports',
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
  'selectInsideString',
  'selectLine',
  'selectNextOccurrence',
  'selectUp',
  'selectUp',
  'selectWord',
  'selectWordLeft',
  'selectWordRight',
  'showHover',
  'sortLinesAscending',
  'toggleBlockComment',
  'toggleComment',
  'toggleLineComment',
  'undo',
]

export const Commands = {
  // TODO command to set cursor position
  ...wrapEditorCommands(ids),

  // TODO
  async showOverlayMessage(state, editor, ...args) {
    await RendererProcess.invoke(...args)
    return state
  },
}

// prettier-ignore
export const LazyCommands = {
  applyEdit: () => import('../EditorCommand/EditorCommandApplyEdit.js'),
  braceCompletion: () => import('../EditorCommand/EditorCommandBraceCompletion.js'),
  closeCompletion: () => import('../EditorCommand/EditorCommandCloseCompletion.js'),
  cursorSet: () => import('../EditorCommand/EditorCommandCursorSet.js'),
  format: () => import('../EditorCommand/EditorCommandFormat.js'),
  handleBeforeInputFromContentEditable: () => import('../EditorCommand/EditorCommandHandleNativeBeforeInputFromContentEditable.js'),
  handleContextMenu: () => import('../EditorCommand/EditorCommandHandleContextMenu.js'),
  handleFocus: () => import('../EditorCommand/EditorCommandHandleFocus.js'),
  handleNativeSelectionChange: () => import('../EditorCommand/EditorCommandHandleNativeSelectionChange.js'),
  handleTab: () => import('../EditorCommand/EditorCommandHandleTab.js'),
  openCompletion: () => import('../EditorCommand/EditorCommandCompletion.js'),
  selectionGrow: () => import('../EditorCommand/EditorCommandSelectionGrow.js'),
  setDecorations: () => import('../EditorCommand/EditorCommandSetDecorations.js'),
  setDeltaY: () => import('../EditorCommand/EditorCommandSetDelta.js'),
  setDelta: () => import('../EditorCommand/EditorCommandSetDelta.js'),
  setLanguageId: () => import('../EditorCommand/EditorCommandSetLanguageId.js'),
  setSelections: () => import('../EditorCommand/EditorCommandSetSelections.js'),
  tabCompletion: () => import('../EditorCommand/EditorCommandTabCompletion.js'),
  type: () => import('../EditorCommand/EditorCommandType.js'),
  unIndent: () => import('../EditorCommand/EditorCommandUnindent.js'),
  replaceRange: () => import('../EditorCommand/EditorCommandReplaceRange.js'),
  showSourceActions: () => import('../EditorCommand/EditorCommandShowSourceActions.js'),
}

export const CommandsWithSideEffectsLazy = {
  typeWithAutoClosing: () => import('../EditorCommand/EditorCommandTypeWithAutoClosing.js'),
  handleBlur: () => import('../EditorCommand/EditorCommandBlur.js'),
}
