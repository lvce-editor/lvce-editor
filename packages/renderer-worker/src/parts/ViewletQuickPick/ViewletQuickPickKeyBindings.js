import * as KeyCode from '../KeyCode/KeyCode.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.Escape,
      command: 'Viewlet.closeWidget',
      args: ['QuickPick'],
      when: 'focus.quickPickInput',
    },
    {
      key: KeyCode.UpArrow,
      command: 'QuickPick.focusPrevious',
      when: 'focus.quickPickInput',
    },
    {
      key: KeyCode.DownArrow,
      command: 'QuickPick.focusNext',
      when: 'focus.quickPickInput',
    },
    {
      key: KeyCode.PageUp,
      command: 'QuickPick.focusFirst',
      when: 'focus.quickPickInput',
    },
    {
      key: KeyCode.PageDown,
      command: 'QuickPick.focusLast',
      when: 'focus.quickPickInput',
    },
    {
      key: KeyCode.Enter,
      command: 'QuickPick.selectCurrentIndex',
      when: 'focus.quickPickInput',
    },
  ]
}
