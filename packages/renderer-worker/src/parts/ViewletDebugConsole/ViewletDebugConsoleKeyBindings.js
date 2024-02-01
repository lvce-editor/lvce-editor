import * as KeyCode from '../KeyCode/KeyCode.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.Enter,
      command: 'Debug Console.evaluate',
      when: WhenExpression.FocusDebugConsoleInput,
    },
  ]
}
