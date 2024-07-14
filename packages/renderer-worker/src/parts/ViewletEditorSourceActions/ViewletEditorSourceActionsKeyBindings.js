import * as KeyCode from '../KeyCode/KeyCode.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.Escape,
      command: 'SourceActions.close',
      when: WhenExpression.FocusSourceActions,
    },
    {
      key: KeyCode.DownArrow,
      command: 'SourceActions.focusNext',
      when: WhenExpression.FocusSourceActions,
    },
    {
      key: KeyCode.UpArrow,
      command: 'SourceActions.focusPrevious',
      when: WhenExpression.FocusSourceActions,
    },
    {
      key: KeyCode.Home,
      command: 'SourceActions.focusFirst',
      when: WhenExpression.FocusSourceActions,
    },
    {
      key: KeyCode.End,
      command: 'SourceActions.focusLast',
      when: WhenExpression.FocusSourceActions,
    },
  ]
}
