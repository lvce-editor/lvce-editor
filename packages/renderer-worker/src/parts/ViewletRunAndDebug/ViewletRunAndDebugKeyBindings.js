import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.Backslash | KeyModifier.CtrlCmd,
      command: 'Run And Debug.continue',
    },
  ]
}
