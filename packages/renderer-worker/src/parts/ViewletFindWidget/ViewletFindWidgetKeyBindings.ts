import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
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
  ]
}
