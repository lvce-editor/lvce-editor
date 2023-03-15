export const getKeyBindings = () => {
  return [
    {
      key: 'Escape',
      command: 'Viewlet.closeWidget',
      args: ['QuickPick'],
      when: 'focus.quickPickInput',
    },
    {
      key: 'ArrowUp',
      command: 'QuickPick.focusPrevious',
      when: 'focus.quickPickInput',
    },
    {
      key: 'ArrowDown',
      command: 'QuickPick.focusNext',
      when: 'focus.quickPickInput',
    },
    {
      key: 'PageUp',
      command: 'QuickPick.focusFirst',
      when: 'focus.quickPickInput',
    },
    {
      key: 'PageDown',
      command: 'QuickPick.focusLast',
      when: 'focus.quickPickInput',
    },
    {
      key: 'Enter',
      command: 'QuickPick.selectCurrentIndex',
      when: 'focus.quickPickInput',
    },
  ]
}
