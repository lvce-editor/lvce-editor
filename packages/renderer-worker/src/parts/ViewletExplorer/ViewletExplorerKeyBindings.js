export const getKeyBindings = () => {
  return [
    {
      key: 'ArrowRight',
      command: 'Explorer.handleArrowRight',
      when: 'focus.Explorer',
    },
    {
      key: 'ArrowLeft',
      command: 'Explorer.handleArrowLeft',
      when: 'focus.Explorer',
    },
    {
      key: 'Home',
      command: 'Explorer.focusFirst',
      when: 'focus.Explorer',
    },
    {
      key: 'End',
      command: 'Explorer.focusLast',
      when: 'focus.Explorer',
    },
    {
      key: 'ArrowUp',
      command: 'Explorer.focusPrevious',
      when: 'focus.Explorer',
    },
    {
      key: 'ArrowDown',
      command: 'Explorer.focusNext',
      when: 'focus.Explorer',
    },
    {
      key: 'shift+*',
      command: 'Explorer.expandAll',
      when: 'focus.Explorer',
    },
    {
      key: 'alt+ArrowRight',
      command: 'Explorer.expandRecursively',
      when: 'focus.Explorer',
    },
    {
      key: 'ctrl+ArrowLeft',
      command: 'Explorer.collapseAll',
      when: 'focus.Explorer',
    },
    {
      key: 'ctrl+v',
      command: 'Explorer.handlePaste',
      when: 'focus.Explorer',
    },
    {
      key: 'ctrl+c',
      command: 'Explorer.handleCopy',
      when: 'focus.Explorer',
    },
    {
      key: 'F2',
      command: 'Explorer.rename',
      when: 'focus.Explorer',
    },
    {
      key: 'Escape',
      command: 'Explorer.cancelEdit',
      when: 'focus.ExplorerEditBox',
    },
    {
      key: 'Enter',
      command: 'Explorer.acceptEdit',
      when: 'focus.ExplorerEditBox',
    },
    {
      key: 'Delete',
      command: 'Explorer.removeDirent',
      when: 'focus.Explorer',
    },
    {
      key: 'Escape',
      command: 'Explorer.focusNone',
      when: 'focus.Explorer',
    },
    {
      key: 'Space',
      command: 'Explorer.handleClickCurrentButKeepFocus',
      when: 'focus.Explorer',
    },
    {
      key: 'Enter',
      command: 'Explorer.handleClickCurrent',
      when: 'focus.Explorer',
    },
  ]
}
