import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyModifier.CtrlCmd | KeyCode.RightArrow,
      command: 'Editor.cursorWordRight',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.LeftArrow,
      command: 'Editor.cursorWordLeft',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.Alt | KeyCode.Backspace,
      command: 'Editor.deleteWordPartLeft',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.Alt | KeyCode.Delete,
      command: 'Editor.deleteWordPartRight',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Backspace,
      command: 'Editor.deleteWordLeft',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Delete,
      command: 'Editor.deleteWordRight',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyD,
      command: 'Editor.selectNextOccurrence',
      when: 'focus.EditorText',
    },
    {
      key: KeyCode.Tab,
      command: 'Editor.handleTab',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.Shift | KeyCode.Tab,
      command: 'Editor.unindent',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.BracketLeft,
      command: 'Editor.indentLess',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.BracketRight,
      command: 'Editor.indentMore',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.Shift | KeyCode.LeftArrow,
      command: 'Editor.selectCharacterLeft',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.LeftArrow,
      command: 'Editor.selectWordLeft',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.Shift | KeyCode.RightArrow,
      command: 'Editor.selectCharacterRight',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.RightArrow,
      command: 'Editor.selectWordRight',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyL,
      command: 'Editor.selectLine',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Backspace,
      command: 'Editor.deleteAllLeft',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Delete,
      command: 'Editor.deleteAllRight',
      when: 'focus.EditorText',
    },
    {
      key: KeyCode.Escape,
      command: 'Editor.cancelSelection',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyZ,
      command: 'Editor.undo',
      when: 'focus.EditorText',
    },
    {
      key: KeyCode.LeftArrow,
      command: 'Editor.cursorLeft',
      when: 'focus.EditorText',
    },
    {
      key: KeyCode.RightArrow,
      command: 'Editor.cursorRight',
      when: 'focus.EditorText',
    },
    {
      key: KeyCode.UpArrow,
      command: 'Editor.cursorUp',
      when: 'focus.EditorText',
    },
    {
      key: KeyCode.DownArrow,
      command: 'Editor.cursorDown',
      when: 'focus.EditorText',
    },
    {
      key: KeyCode.Backspace,
      command: 'Editor.deleteLeft',
      when: 'focus.EditorText',
    },
    {
      key: KeyCode.Delete,
      command: 'Editor.deleteRight',
      when: 'focus.EditorText',
    },
    {
      key: KeyCode.Enter,
      command: 'Editor.insertLineBreak',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyD,
      command: 'Editor.copyLineDown',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.DownArrow,
      command: 'Editor.moveLineDown',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.UpArrow,
      command: 'Editor.moveLineUp',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Space,
      command: 'Editor.openCompletion',
      when: 'focus.EditorText',
    },
    {
      key: KeyCode.F2,
      command: 'EditorRename.open',
      when: 'focus.EditorText',
    },
    {
      key: KeyCode.Home,
      command: 'Editor.cursorHome',
      when: 'focus.EditorText',
    },
    {
      key: KeyCode.End,
      command: 'Editor.cursorEnd',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Slash,
      command: 'Editor.toggleComment',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyC,
      command: 'Editor.copy',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyA,
      command: 'Editor.selectAll',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyH,
      command: 'Editor.showHover',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.Alt | KeyCode.LeftArrow,
      command: 'Editor.cursorWordPartLeft',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.Alt | KeyCode.RightArrow,
      command: 'Editor.cursorWordPartRight',
      when: 'focus.EditorText',
    },
    {
      key: KeyModifier.Alt | KeyCode.F3,
      command: 'Editor.selectAllOccurrences',
      when: 'focus.EditorText',
    },
  ]
}
