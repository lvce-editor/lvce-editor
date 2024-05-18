import * as KeyCode from '../KeyCode/KeyCode.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.Escape,
      command: 'About.handleClickClose',
      when: WhenExpression.FocusAbout,
    },
    {
      key: KeyCode.Tab,
      command: 'About.focusNext',
      when: WhenExpression.FocusAbout,
    },
    {
      key: KeyCode.Tab | KeyModifier.Shift,
      command: 'About.focusPrevious',
      when: WhenExpression.FocusAbout,
    },
  ]
}
