import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.Escape,
      command: 'Editor.closeSourceAction',
      when: WhenExpression.FocusSourceActions,
    },
    {
      key: KeyCode.DownArrow,
      command: 'EditorSourceActions.focusNext',
      when: WhenExpression.FocusSourceActions,
    },
    {
      key: KeyCode.UpArrow,
      command: 'EditorSourceActions.focusPrevious',
      when: WhenExpression.FocusSourceActions,
    },
    {
      key: KeyCode.Home,
      command: 'EditorSourceActions.focusFirst',
      when: WhenExpression.FocusSourceActions,
    },
    {
      key: KeyCode.End,
      command: 'EditorSourceActions.focusLast',
      when: WhenExpression.FocusSourceActions,
    },
    {
      key: KeyCode.Enter,
      command: 'EditorSourceActions.selectCurrent',
      when: WhenExpression.FocusSourceActions,
    },
    {
      key: KeyCode.Enter,
      command: 'FindWidget.focusNext',
      when: WhenExpression.FocusFindWidget,
    },
    {
      key: KeyModifier.Shift | KeyCode.F4,
      command: 'FindWidget.focusPrevious',
      when: WhenExpression.FocusFindWidget,
    },
    {
      key: KeyCode.F4,
      command: 'FindWidget.focusNext',
      when: WhenExpression.FocusFindWidget,
    },
    {
      key: KeyModifier.Shift | KeyCode.Tab,
      command: 'FindWidget.focusToggleReplace',
      when: WhenExpression.FocusFindWidget,
    },
    {
      key: KeyCode.Tab,
      command: 'FindWidget.focusReplace',
      when: WhenExpression.FocusFindWidget,
    },
    {
      key: KeyCode.Tab,
      command: 'FindWidget.focusPreviousMatchButton',
      when: WhenExpression.FocusFindWidgetReplace,
    },
    {
      key: KeyCode.Tab,
      command: 'FindWidget.focusNextMatchButton',
      when: WhenExpression.FocusFindWidgetPreviousMatchButton,
    },
    {
      key: KeyModifier.Shift | KeyCode.Tab,
      command: 'FindWidget.focusReplace',
      when: WhenExpression.FocusFindWidgetPreviousMatchButton,
    },
    {
      key: KeyModifier.Shift | KeyCode.Tab,
      command: 'FindWidget.focusPreviousMatchButton',
      when: WhenExpression.FocusFindWidgetNextMatchButton,
    },
    {
      key: KeyCode.Tab,
      command: 'FindWidget.focusCloseButton',
      when: WhenExpression.FocusFindWidgetNextMatchButton,
    },
    {
      key: KeyModifier.Shift | KeyCode.Tab,
      command: 'FindWidget.focusNextMatchButton',
      when: WhenExpression.FocusFindWidgetCloseButton,
    },
    {
      key: KeyCode.Tab,
      command: 'FindWidget.focusReplaceButton',
      when: WhenExpression.FocusFindWidgetCloseButton,
    },
    {
      key: KeyModifier.Shift | KeyCode.Tab,
      command: 'FindWidget.focusFind',
      when: WhenExpression.FocusFindWidgetReplace,
    },
    {
      key: KeyCode.Tab,
      command: 'FindWidget.focusReplaceAllButton',
      when: WhenExpression.FocusFindWidgetReplaceButton,
    },
    {
      key: KeyModifier.Shift | KeyCode.Tab,
      command: 'FindWidget.focusCloseButton',
      when: WhenExpression.FocusFindWidgetReplaceButton,
    },
    {
      key: KeyModifier.Shift | KeyCode.Tab,
      command: 'FindWidget.focusReplaceButton',
      when: WhenExpression.FocusFindWidgetReplaceAllButton,
    },
    {
      key: KeyCode.DownArrow,
      command: 'EditorCompletion.focusNext',
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      key: KeyCode.UpArrow,
      command: 'EditorCompletion.focusPrevious',
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      key: KeyCode.Enter,
      command: 'EditorCompletion.selectCurrent',
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      key: KeyCode.Escape,
      command: 'Editor.closeCompletion',
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      key: KeyCode.End,
      command: 'EditorCompletion.focusLast',
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      key: KeyCode.Home,
      command: 'EditorCompletion.focusFirst',
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Space,
      command: 'EditorCompletion.toggleDetails',
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.RightArrow,
      command: 'Editor.cursorWordRight',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.LeftArrow,
      command: 'Editor.cursorWordLeft',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.Alt | KeyCode.Backspace,
      command: 'Editor.deleteWordPartLeft',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.Alt | KeyCode.Delete,
      command: 'Editor.deleteWordPartRight',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Backspace,
      command: 'Editor.deleteWordLeft',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Delete,
      command: 'Editor.deleteWordRight',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyD,
      command: 'Editor.selectNextOccurrence',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyJ,
      command: 'Editor.openColorPicker',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Period,
      command: 'Editor.showSourceActions2',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyCode.Tab,
      command: 'Editor.handleTab',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.Shift | KeyCode.Tab,
      command: 'Editor.unindent',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.BracketLeft,
      command: 'Editor.indentLess',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyCode.Escape,
      command: 'Editor.closeFind',
      when: WhenExpression.FocusFindWidget,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyF,
      command: 'Editor.openFind2',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.BracketRight,
      command: 'Editor.indentMore',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.Shift | KeyCode.LeftArrow,
      command: 'Editor.selectCharacterLeft',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.LeftArrow,
      command: 'Editor.selectWordLeft',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.Shift | KeyCode.RightArrow,
      command: 'Editor.selectCharacterRight',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.RightArrow,
      command: 'Editor.selectWordRight',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyL,
      command: 'Editor.selectLine',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Backspace,
      command: 'Editor.deleteAllLeft',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Delete,
      command: 'Editor.deleteAllRight',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyCode.Escape,
      command: 'Editor.cancelSelection',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyZ,
      command: 'Editor.undo',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyCode.LeftArrow,
      command: 'Editor.cursorLeft',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyCode.RightArrow,
      command: 'Editor.cursorRight',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyCode.UpArrow,
      command: 'Editor.cursorUp',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyCode.DownArrow,
      command: 'Editor.cursorDown',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyCode.Backspace,
      command: 'Editor.deleteLeft',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyCode.Delete,
      command: 'Editor.deleteRight',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyCode.Enter,
      command: 'Editor.insertLineBreak',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyD,
      command: 'Editor.copyLineDown',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.DownArrow,
      command: 'Editor.moveLineDown',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.UpArrow,
      command: 'Editor.moveLineUp',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Space,
      command: 'Editor.openCompletion',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyCode.F2,
      command: 'EditorRename.open',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyCode.Home,
      command: 'Editor.cursorHome',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyCode.End,
      command: 'Editor.cursorEnd',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Slash,
      command: 'Editor.toggleComment',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyC,
      command: 'Editor.copy',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyA,
      command: 'Editor.selectAll',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyH,
      command: 'Editor.showHover2',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyX,
      command: 'Editor.cut',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyV,
      command: 'Editor.paste',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.Alt | KeyCode.LeftArrow,
      command: 'Editor.cursorWordPartLeft',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.Alt | KeyCode.RightArrow,
      command: 'Editor.cursorWordPartRight',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.Alt | KeyCode.F3,
      command: 'Editor.selectAllOccurrences',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.Alt | KeyModifier.Shift | KeyCode.UpArrow,
      command: 'Editor.addCursorAbove',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.Alt | KeyModifier.Shift | KeyCode.DownArrow,
      command: 'Editor.addCursorBelow',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.Alt | KeyModifier.Shift | KeyCode.F12,
      command: 'Editor.findAllReferences',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.Alt | KeyModifier.Shift | KeyCode.KeyO,
      command: 'Editor.organizeImports',
      when: WhenExpression.FocusEditorText,
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Space,
      command: 'Editor.selectionGrow',
      when: WhenExpression.FocusEditor,
    },
  ]
}
