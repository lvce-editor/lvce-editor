import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyW,
      command: 'Main.closeActiveEditor',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Tab,
      command: 'Main.focusNext',
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Tab,
      command: 'Main.focusPrevious',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Digit1,
      command: 'Main.focus',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyS,
      command: 'Main.save',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Backslash,
      command: 'Main.splitRight',
    },
  ]
}
