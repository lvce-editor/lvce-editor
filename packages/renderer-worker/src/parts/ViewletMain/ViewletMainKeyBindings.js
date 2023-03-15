export const getKeyBindings = () => {
  return [
    {
      key: 'ctrl+w',
      command: 'Main.closeActiveEditor',
    },
    {
      key: 'ctrl+Tab',
      command: 'Main.focusNext',
    },
    {
      key: 'ctrl+shift+Tab',
      command: 'Main.focusPrevious',
    },
    {
      key: 'ctrl+1',
      command: 'Main.focus',
    },
    {
      key: 'ctrl+s',
      command: 'Main.save',
    },
  ]
}
