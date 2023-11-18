import * as KeyCode from '../KeyCode/KeyCode.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.DownArrow,
      command: 'ActivityBar.focusNext',
      when: 'focus.activityBar',
    },
    {
      key: KeyCode.UpArrow,
      command: 'ActivityBar.focusPrevious',
      when: 'focus.activityBar',
    },
    {
      key: KeyCode.Home,
      command: 'ActivityBar.focusFirst',
      when: 'focus.activityBar',
    },
    {
      key: KeyCode.PageUp,
      command: 'ActivityBar.focusFirst',
      when: 'focus.activityBar',
    },
    {
      key: KeyCode.PageDown,
      command: 'ActivityBar.focusLast',
      when: 'focus.activityBar',
    },
    {
      key: KeyCode.End,
      command: 'ActivityBar.focusLast',
      when: 'focus.activityBar',
    },
    {
      key: KeyCode.Space,
      command: 'ActivityBar.selectCurrent',
      when: 'focus.activityBar',
    },
    {
      key: KeyCode.Enter,
      command: 'ActivityBar.selectCurrent',
      when: 'focus.activityBar',
    },
    {
      key: KeyCode.Home,
      command: 'ActivityBar.focusFirst',
      when: 'focus.activityBar',
    },
    {
      key: KeyCode.End,
      command: 'ActivityBar.focusLast',
      when: 'focus.activityBar',
    },
  ]
}
