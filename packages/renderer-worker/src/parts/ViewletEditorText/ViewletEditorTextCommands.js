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
  'applyEdit',
  'braceCompletion',
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
  'handleContextMenu',
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
  'replaceRange',
  'save',
  'selectAll',
  'selectAllLeft',
  'selectAllOccurrences',
  'selectAllRight',
  'selectCharacterLeft',
  'selectCharacterRight',
  'selectDown',
  'selectInsideString',
  'selectLine',
  'selectNextOccurrence',
  'selectUp',
  'selectWord',
  'selectWordLeft',
  'selectWordRight',
  'setDelta',
  'setDeltaY',
  'showHover',
  'showSourceActions',
  'sortLinesAscending',
  'toggleBlockComment',
  'toggleComment',
  'toggleLineComment',
  'type',
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
  closeCompletion: () => import('../EditorCommand/EditorCommandCloseCompletion.js'),
  cursorSet: () => import('../EditorCommand/EditorCommandCursorSet.js'),
  format: () => import('../EditorCommand/EditorCommandFormat.js'),
  handleBeforeInputFromContentEditable: () => import('../EditorCommand/EditorCommandHandleNativeBeforeInputFromContentEditable.js'),
  handleFocus: () => import('../EditorCommand/EditorCommandHandleFocus.js'),
  handleNativeSelectionChange: () => import('../EditorCommand/EditorCommandHandleNativeSelectionChange.js'),
  handleTab: () => import('../EditorCommand/EditorCommandHandleTab.js'),
  openCompletion: () => import('../EditorCommand/EditorCommandCompletion.js'),
  selectionGrow: () => import('../EditorCommand/EditorCommandSelectionGrow.js'),
  setDecorations: () => import('../EditorCommand/EditorCommandSetDecorations.js'),
  setLanguageId: () => import('../EditorCommand/EditorCommandSetLanguageId.js'),
  setSelections: () => import('../EditorCommand/EditorCommandSetSelections.js'),
  tabCompletion: () => import('../EditorCommand/EditorCommandTabCompletion.js'),
  unIndent: () => import('../EditorCommand/EditorCommandUnindent.js'),
}

export const CommandsWithSideEffectsLazy = {
  typeWithAutoClosing: () => import('../EditorCommand/EditorCommandTypeWithAutoClosing.js'),
  handleBlur: () => import('../EditorCommand/EditorCommandBlur.js'),
}
