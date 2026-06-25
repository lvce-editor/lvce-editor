import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as WrapEditorCommands from '../WrapEditorCommands/WrapEditorCommands.js'
import * as EditorWorker from '../EditorWorker/EditorWorker.ts'

const subWidgetCommandIds = [
  'ColorPicker.handleSliderPointerDown',
  'ColorPicker.handleSliderPointerMove',
  'EditorCodeGenerator.accept',
  'EditorCompletion.close',
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
  'EditorCompletion.handlePointerDown',
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
  'EditorRename.accept',
  'EditorRename.handleBlur',
  'EditorRename.handleInput',
  'EditorRename.close',
  'EditorSourceActions.close',
  'EditorSourceActions.focusFirst',
  'EditorSourceActions.focusLast',
  'EditorSourceActions.focusNext',
  'EditorSourceActions.focusPrevious',
  'EditorSourceActions.selectCurrent',
  'FindWidget.close',
  'FindWidget.focusNextElement',
  'FindWidget.focusPreviousElement',
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
  'FindWidget.replace',
  'FindWidget.replaceAll',
  'FindWidget.toggleMatchCase',
  'FindWidget.toggleMatchWholeWord',
  'FindWidget.toggleReplace',
  'FindWidget.toggleUseRegularExpression',
  'FindWidget.togglePreserveCase',
  'EditorSourceAction.close',
  'EditorSourceAction.closeDetails',
  'EditorSourceAction.focusFirst',
  'EditorSourceAction.focusIndex',
  'EditorSourceAction.focusNext',
  'EditorSourceAction.focusPrevious',
  'EditorSourceAction.handleWheel',
  'EditorSourceAction.selectCurrent',
  'EditorSourceAction.selectIndex',
  'EditorSourceAction.selectItem',
  'EditorSourceAction.toggleDetails',
]

export const Commands = {}

const showOverlayMessage = async (state, editor, ...args) => {
  await RendererProcess.invoke(...args)
  return state
}

const hotReload = async (state, editor, ...args) => {
  // @ts-ignore
  await EditorWorker.invoke(`Editor.hotReload`)
  return state
}

export const getCommands = async () => {
  const commandIds = await EditorWorker.invoke('Editor.getCommandIds')
  Object.assign(Commands, WrapEditorCommands.wrapEditorCommands(commandIds), WrapEditorCommands.wrapEditorCommands(subWidgetCommandIds), {
    showOverlayMessage,
    hotReload,
  })
  return Commands
}

export const CommandsWithSideEffectsLazy = {
  typeWithAutoClosing: () => {
    return {
      typeWithAutoClosing: WrapEditorCommands.wrapEditorCommand('typeWithAutoClosing'),
    }
  },
}
