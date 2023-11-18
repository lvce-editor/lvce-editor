import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.Home,
      command: 'Extensions.focusFirst',
      when: 'focus.Extensions',
    },
    {
      key: KeyCode.End,
      command: 'Extensions.focusLast',
      when: 'focus.Extensions',
    },
    {
      key: KeyCode.PageUp,
      command: 'Extensions.focusPreviousPage',
      when: 'focus.Extensions',
    },
    {
      key: KeyCode.PageDown,
      command: 'Extensions.focusNextPage',
      when: 'focus.Extensions',
    },
    {
      key: KeyCode.UpArrow,
      command: 'Extensions.focusPrevious',
      when: 'focus.Extensions',
    },
    {
      key: KeyCode.DownArrow,
      command: 'Extensions.focusNext',
      when: 'focus.Extensions',
    },
    {
      key: KeyCode.Space,
      command: 'Extensions.handleClickCurrentButKeepFocus',
      when: 'focus.Extensions',
    },
    {
      key: KeyCode.Enter,
      command: 'Extensions.handleClickCurrent',
      when: 'focus.Extensions',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Space,
      command: 'Extensions.toggleSuggest',
      when: 'focus.Extensions',
    },
  ]
}
