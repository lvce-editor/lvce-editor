export const getKeyBindings = () => {
  return [
    {
      key: 'ctrl+ArrowRight',
      command: 'Editor.cursorWordRight',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+ArrowLeft',
      command: 'Editor.cursorWordLeft',
      when: 'focus.EditorText',
    },
    {
      key: 'alt+Backspace',
      command: 'Editor.deleteWordPartLeft',
      when: 'focus.EditorText',
    },
    {
      key: 'alt+Delete',
      command: 'Editor.deleteWordPartRight',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+Backspace',
      command: 'Editor.deleteWordLeft',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+Delete',
      command: 'Editor.deleteWordRight',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+d',
      command: 'Editor.selectNextOccurrence',
      when: 'focus.EditorText',
    },
    {
      key: 'Tab',
      command: 'Editor.handleTab',
      when: 'focus.EditorText',
    },
    {
      key: 'shift+Tab',
      command: 'Editor.unindent',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+[',
      command: 'Editor.indentLess',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+]',
      command: 'Editor.indentMore',
      when: 'focus.EditorText',
    },
    {
      key: 'shift+ArrowLeft',
      command: 'Editor.selectCharacterLeft',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+shift+ArrowLeft',
      command: 'Editor.selectWordLeft',
      when: 'focus.EditorText',
    },
    {
      key: 'shift+ArrowRight',
      command: 'Editor.selectCharacterRight',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+shift+ArrowRight',
      command: 'Editor.selectWordRight',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+l',
      command: 'Editor.selectLine',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+shift+Backspace',
      command: 'Editor.deleteAllLeft',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+shift+Delete',
      command: 'Editor.deleteAllRight',
      when: 'focus.EditorText',
    },
    {
      key: 'Escape',
      command: 'Editor.cancelSelection',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+z',
      command: 'Editor.undo',
      when: 'focus.EditorText',
    },
    {
      key: 'ArrowLeft',
      command: 'Editor.cursorLeft',
      when: 'focus.EditorText',
    },
    {
      key: 'ArrowRight',
      command: 'Editor.cursorRight',
      when: 'focus.EditorText',
    },
    {
      key: 'ArrowUp',
      command: 'Editor.cursorUp',
      when: 'focus.EditorText',
    },
    {
      key: 'ArrowDown',
      command: 'Editor.cursorDown',
      when: 'focus.EditorText',
    },
    {
      key: 'Backspace',
      command: 'Editor.deleteLeft',
      when: 'focus.EditorText',
    },
    {
      key: 'Delete',
      command: 'Editor.deleteRight',
      when: 'focus.EditorText',
    },
    {
      key: 'Enter',
      command: 'Editor.insertLineBreak',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+shift+d',
      command: 'Editor.copyLineDown',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+shift+ArrowDown',
      command: 'Editor.moveLineDown',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+shift+ArrowUp',
      command: 'Editor.moveLineUp',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+Space',
      command: 'Editor.openCompletion',
      when: 'focus.EditorText',
    },
    {
      key: 'F2',
      command: 'EditorRename.open',
      when: 'focus.EditorText',
    },
    {
      key: 'Home',
      command: 'Editor.cursorHome',
      when: 'focus.EditorText',
    },
    {
      key: 'End',
      command: 'Editor.cursorEnd',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+/',
      command: 'Editor.toggleComment',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+c',
      command: 'Editor.copy',
      when: 'focus.EditorText',
    },
    {
      key: 'ctrl+a',
      command: 'Editor.selectAll',
      when: 'focus.EditorText',
    },
    {
      key: 'alt+ArrowLeft',
      command: 'Editor.cursorWordPartLeft',
      when: 'focus.EditorText',
    },
    {
      key: 'alt+ArrowRight',
      command: 'Editor.cursorWordPartRight',
      when: 'focus.EditorText',
    },
    {
      key: 'alt+F3',
      command: 'Editor.selectAllOccurrences',
      when: 'focus.EditorText',
    },
  ]
}
