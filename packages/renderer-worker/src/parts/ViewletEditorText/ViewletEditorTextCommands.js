import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const wrapEditorCommand = (id) => {
  return async (...args) => {
    if (args.length === 0) {
      throw new Error('missing arg')
    }
    const editor = args[0]
    const restArgs = args.slice(1)
    const fullId = id.includes('.') ? id : `Editor.${id}`
    // @ts-ignore
    const result = await EditorWorker.invoke(fullId, editor.uid, ...restArgs)
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
  'cancelSelection',
  'closeCompletion',
  'closeCompletion',
  'closeFind',
  'closeSourceAction',
  'closeSourceActions',
  'ColorPicker.handleSliderPointerDown',
  'ColorPicker.handleSliderPointerMove',
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
  'EditorCompletion.closeDetails',
  'EditorCompletion.dispose',
  'EditorCompletion.focusFirst',
  'EditorCompletion.focusIndex',
  'EditorCompletion.focusLast',
  'EditorCompletion.focusNext',
  'EditorCompletion.focusNextPage',
  'EditorCompletion.focusPrevious',
  'EditorCompletion.focusPreviousPage',
  'EditorCompletion.handleClickAt',
  'EditorCompletion.handleScrollBarCaptureLost',
  'EditorCompletion.handleScrollBarClick',
  'EditorCompletion.handleScrollBarMove',
  'EditorCompletion.handleScrollBarThumbPointerMove',
  'EditorCompletion.handleWheel',
  'EditorCompletion.openDetails',
  'EditorCompletion.scrollDown',
  'EditorCompletion.selectCurrent',
  'EditorCompletion.selectIndex',
  'EditorCompletion.toggleDetails',
  'EditorSourceActions.close',
  'EditorSourceActions.focusFirst',
  'EditorSourceActions.focusLast',
  'EditorSourceActions.focusNext',
  'EditorSourceActions.focusPrevious',
  'EditorSourceActions.selectCurrent',
  'findAllReferences',
  'FindWidget.close',
  'FindWidget.replaceAll',
  'FindWidget.focusCloseButton',
  'FindWidget.focusFind',
  'FindWidget.focusNext',
  'FindWidget.focusNextMatchButton',
  'FindWidget.focusPrevious',
  'FindWidget.focusPreviousMatchButton',
  'FindWidget.focusReplace',
  'FindWidget.focusReplaceAllButton',
  'FindWidget.focusReplaceButton',
  'FindWidget.focusToggleReplace',
  'FindWidget.handleBlur',
  'FindWidget.handleFocus',
  'FindWidget.handleFocusClose',
  'FindWidget.handleFocusNext',
  'FindWidget.handleFocusPrevious',
  'FindWidget.handleFocusReplaceAll',
  'FindWidget.handleInput',
  'FindWidget.handleReplaceFocus',
  'FindWidget.handleReplaceInput',
  'FindWidget.handleToggleReplaceFocus',
  'FindWidget.replaceAll',
  'FindWidget.toggleMatchCase',
  'FindWidget.toggleMatchWholeWord',
  'FindWidget.toggleReplace',
  'FindWidget.toggleUseRegularExpression',
  'format',
  'getText',
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
  'openColorPicker',
  'openCompletion',
  'openFind',
  'openFind2',
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
  'setLanguageId',
  'setSelections',
  'showHover',
  'showHover2',
  'showSourceActions',
  'showSourceActions2',
  'sortImports',
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

export const CommandsWithSideEffectsLazy = {
  typeWithAutoClosing: () => {
    return {
      typeWithAutoClosing: wrapEditorCommand('typeWithAutoClosing'),
    }
  },
}
