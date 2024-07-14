import * as KeyCode from '../KeyCode/KeyCode.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.Escape,
      command: 'EditorSourceActions.close',
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
  ]
}
