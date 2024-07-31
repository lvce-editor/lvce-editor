import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const wrapEditorCommand = (id) => {
  return async (...args) => {
    if (args.length === 0) {
      throw new Error('missing arg')
    }
    const editor = args[0]
    const restArgs = args.slice(1)
    // @ts-ignore
    const result = await EditorWorker.invoke(`Editor.${id}`, editor.uid, ...restArgs)
    if (result && result.commands) {
      return {
        ...editor,
        commands: result.commands,
      }
    }
    return result
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
  'format',
  'getWordAt',
  'getWordBefore',
  'goToDefinition',
  'goToTypeDefinition',
  'handleBeforeInput',
  'handleBeforeInputFromContentEditable',
  'handleBlur',
  'handleContextMenu',
  'handleDoubleClick',
  'handleFocus',
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
  'handleTab',
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
  'setLanguageId',
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
  openCompletion: () => import('../EditorCommand/EditorCommandCompletion.js'),
}

export const CommandsWithSideEffectsLazy = {
  typeWithAutoClosing: () => {
    return {
      typeWithAutoClosing: wrapEditorCommand('typeWithAutoClosing'),
    }
  },
}
