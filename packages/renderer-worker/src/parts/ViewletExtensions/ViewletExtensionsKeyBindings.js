export const getKeyBindings = () => {
  return [
    {
      key: 'Home',
      command: 'Extensions.focusFirst',
      when: 'focus.Extensions',
    },
    {
      key: 'End',
      command: 'Extensions.focusLast',
      when: 'focus.Extensions',
    },
    {
      key: 'PageUp',
      command: 'Extensions.focusPreviousPage',
      when: 'focus.Extensions',
    },
    {
      key: 'PageDown',
      command: 'Extensions.focusNextPage',
      when: 'focus.Extensions',
    },
    {
      key: 'ArrowUp',
      command: 'Extensions.focusPrevious',
      when: 'focus.Extensions',
    },
    {
      key: 'ArrowDown',
      command: 'Extensions.focusNext',
      when: 'focus.Extensions',
    },
    {
      key: 'Space',
      command: 'Extensions.handleClickCurrentButKeepFocus',
      when: 'focus.Extensions',
    },
    {
      key: 'Enter',
      command: 'Extensions.handleClickCurrent',
      when: 'focus.Extensions',
    },
    {
      key: 'ctrl+Space',
      command: 'Extensions.toggleSuggest',
      when: 'focus.Extensions',
    },
  ]
}
