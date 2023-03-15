export const getKeyBindings = () => {
  return [
    {
      key: 'ArrowDown',
      command: 'EditorCompletion.focusNext',
      when: 'focus.editorCompletions',
    },
    {
      key: 'ArrowUp',
      command: 'EditorCompletion.focusPrevious',
      when: 'focus.editorCompletions',
    },
    {
      key: 'Enter',
      command: 'EditorCompletion.selectCurrent',
      when: 'focus.editorCompletions',
    },
    {
      key: 'Escape',
      command: 'EditorCompletion.close',
      when: 'focus.editorCompletions',
    },
  ]
}
