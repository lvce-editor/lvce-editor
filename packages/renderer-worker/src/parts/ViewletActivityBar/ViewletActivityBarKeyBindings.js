export const getKeyBindings = () => {
  return [
    {
      key: 'ArrowDown',
      command: 'ActivityBar.focusNext',
      when: 'focus.activityBar',
    },
    {
      key: 'ArrowUp',
      command: 'ActivityBar.focusPrevious',
      when: 'focus.activityBar',
    },
    {
      key: 'Home',
      command: 'ActivityBar.focusFirst',
      when: 'focus.activityBar',
    },
    {
      key: 'PageUp',
      command: 'ActivityBar.focusFirst',
      when: 'focus.activityBar',
    },
    {
      key: 'PageDown',
      command: 'ActivityBar.focusLast',
      when: 'focus.activityBar',
    },
    {
      key: 'End',
      command: 'ActivityBar.focusLast',
      when: 'focus.activityBar',
    },
    {
      key: 'Space',
      command: 'ActivityBar.selectCurrent',
      when: 'focus.activityBar',
    },
    {
      key: 'Enter',
      command: 'ActivityBar.selectCurrent',
      when: 'focus.activityBar',
    },
    {
      key: 'Home',
      command: 'ActivityBar.focusFirst',
      when: 'focus.activityBar',
    },
    {
      key: 'End',
      command: 'ActivityBar.focusLast',
      when: 'focus.activityBar',
    },
  ]
}
