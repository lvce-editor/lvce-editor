import * as KeyCode from '../KeyCode/KeyCode.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.DownArrow,
      command: 'ActivityBar.focusNext',
      when: WhenExpression.FocusActivityBar,
    },
    {
      key: KeyCode.UpArrow,
      command: 'ActivityBar.focusPrevious',
      when: WhenExpression.FocusActivityBar,
    },
    {
      key: KeyCode.Home,
      command: 'ActivityBar.focusFirst',
      when: WhenExpression.FocusActivityBar,
    },
    {
      key: KeyCode.PageUp,
      command: 'ActivityBar.focusFirst',
      when: WhenExpression.FocusActivityBar,
    },
    {
      key: KeyCode.PageDown,
      command: 'ActivityBar.focusLast',
      when: WhenExpression.FocusActivityBar,
    },
    {
      key: KeyCode.End,
      command: 'ActivityBar.focusLast',
      when: WhenExpression.FocusActivityBar,
    },
    {
      key: KeyCode.Space,
      command: 'ActivityBar.selectCurrent',
      when: WhenExpression.FocusActivityBar,
    },
    {
      key: KeyCode.Enter,
      command: 'ActivityBar.selectCurrent',
      when: WhenExpression.FocusActivityBar,
    },
  ]
}
