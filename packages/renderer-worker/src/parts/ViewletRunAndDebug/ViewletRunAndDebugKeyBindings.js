import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.Backslash | KeyModifier.CtrlCmd,
      command: 'Run And Debug.continue',
    },
    {
      key: KeyCode.LeftArrow,
      command: 'Run And Debug.handleArrowLeft',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyCode.Home,
      command: 'Run And Debug.focusFirst',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyCode.End,
      command: 'Run And Debug.focusLast',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyCode.UpArrow,
      command: 'Run And Debug.focusPrevious',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyCode.DownArrow,
      command: 'Run And Debug.focusNext',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Star,
      command: 'Run And Debug.expandAll',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyModifier.Alt | KeyCode.RightArrow,
      command: 'Run And Debug.expandRecursively',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.LeftArrow,
      command: 'Run And Debug.collapseAll',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyV,
      command: 'Run And Debug.handlePaste',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyC,
      command: 'Run And Debug.handleCopy',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyCode.F2,
      command: 'Run And Debug.rename',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyCode.Escape,
      command: 'Run And Debug.cancelEdit',
      // @ts-ignore
      when: WhenExpression.FocusDebugScopeEditBox,
    },
    {
      key: KeyCode.Enter,
      command: 'Run And Debug.acceptEdit',
      // @ts-ignore
      when: WhenExpression.FocusDebugScopeEditBox,
    },
    {
      key: KeyCode.Delete,
      command: 'Run And Debug.removeDirent',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyCode.Escape,
      command: 'Run And Debug.focusNone',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyCode.Space,
      command: 'Run And Debug.handleClickCurrentButKeepFocus',
      when: WhenExpression.FocusDebugScope,
    },
    {
      key: KeyCode.Enter,
      command: 'Run And Debug.handleClickCurrent',
      when: WhenExpression.FocusDebugScope,
    },
  ]
}
