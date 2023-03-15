export const getKeyBindings = () => {
  return [
    {
      key: 'ArrowDown',
      command: 'Search.focusNext',
      when: 'focus.SearchResults',
    },
    {
      key: 'ArrowUp',
      command: 'Search.focusPrevious',
      when: 'focus.SearchResults',
    },
    {
      key: 'Delete',
      command: 'Search.dismissItem',
      when: 'focus.SearchResults',
    },
    {
      key: 'Home',
      command: 'Search.focusFirst',
      when: 'focus.SearchResults',
    },
    {
      key: 'End',
      command: 'Search.focusLast',
      when: 'focus.SearchResults',
    },
    {
      key: 'ctrl+c',
      command: 'Search.copy',
      when: 'focus.SearchResults',
    },
  ]
}
