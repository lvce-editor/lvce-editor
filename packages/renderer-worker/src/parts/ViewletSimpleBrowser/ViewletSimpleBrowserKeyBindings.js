import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyI,
      command: 'Developer.toggleDeveloperTools',
      when: WhenExpression.FocusSimpleBrowser,
    },
  ]
}
