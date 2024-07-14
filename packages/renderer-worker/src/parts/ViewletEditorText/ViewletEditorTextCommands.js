import * as EditorWorker from '../EditorWorker/EditorWorker.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

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
  'closeCompletion',
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
  'cursorSet',
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
  'handleBeforeInput',
  'handleBeforeInputFromContentEditable',
  'handleContextMenu',
  'handleDoubleClick',
  'handleMouseDown',
  'handleMouseMove',
  'handleMouseMoveWithAltKey',
  'handleNativeSelectionChange',
  'handlePointerCaptureLost',
  'handleScrollBarClick',
  'handleScrollBarHorizontalMove',
  'handleScrollBarHorizontalPointerDown',
  'handleScrollBarMove',
  'handleScrollBarPointerDown',
  'handleScrollBarVerticalMove',
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
  'save',
  'selectAll',
  'selectAllLeft',
  'selectAllOccurrences',
  'selectAllRight',
  'selectCharacterLeft',
  'selectCharacterRight',
  'selectDown',
  'selectInsideString',
  'selectionGrow',
  'selectLine',
  'selectNextOccurrence',
  'selectUp',
  'selectWord',
  'selectWordLeft',
  'selectWordRight',
  'setDecorations',
  'setDelta',
  'setDeltaY',
  'setSelections',
  'showHover',
  'showSourceActions',
  'sortLinesAscending',
  'tabCompletion',
  'toggleBlockComment',
  'toggleComment',
  'toggleLineComment',
  'type',
  'undo',
  'unIndent',
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
  format: () => import('../EditorCommand/EditorCommandFormat.js'),
  handleFocus: () => import('../EditorCommand/EditorCommandHandleFocus.js'),
  handleTab: () => import('../EditorCommand/EditorCommandHandleTab.js'),
  openCompletion: () => import('../EditorCommand/EditorCommandCompletion.js'),
  setLanguageId: () => import('../EditorCommand/EditorCommandSetLanguageId.js'),
}

export const CommandsWithSideEffectsLazy = {
  typeWithAutoClosing: () => {
    return {
      typeWithAutoClosing: wrapEditorCommand('typeWithAutoClosing'),
    }
  },

  // TODO
  handleBlur: () => import('../EditorCommand/EditorCommandBlur.js'),
}
