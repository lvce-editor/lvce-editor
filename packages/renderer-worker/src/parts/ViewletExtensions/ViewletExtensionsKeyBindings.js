import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.Home,
      command: 'Extensions.focusFirst',
      when: WhenExpression.FocusExtensions,
    },
    {
      key: KeyCode.End,
      command: 'Extensions.focusLast',
      when: WhenExpression.FocusExtensions,
    },
    {
      key: KeyCode.PageUp,
      command: 'Extensions.focusPreviousPage',
      when: WhenExpression.FocusExtensions,
    },
    {
      key: KeyCode.PageDown,
      command: 'Extensions.focusNextPage',
      when: WhenExpression.FocusExtensions,
    },
    {
      key: KeyCode.UpArrow,
      command: 'Extensions.focusPrevious',
      when: WhenExpression.FocusExtensions,
    },
    {
      key: KeyCode.DownArrow,
      command: 'Extensions.focusNext',
      when: WhenExpression.FocusExtensions,
    },
    {
      key: KeyCode.Space,
      command: 'Extensions.handleClickCurrentButKeepFocus',
      when: WhenExpression.FocusExtensions,
    },
    {
      key: KeyCode.Enter,
      command: 'Extensions.handleClickCurrent',
      when: WhenExpression.FocusExtensions,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Space,
      command: 'Extensions.toggleSuggest',
      when: WhenExpression.FocusExtensions,
    },
  ]
}
