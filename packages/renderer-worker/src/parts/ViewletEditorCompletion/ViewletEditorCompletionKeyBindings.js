import * as KeyCode from '../KeyCode/KeyCode.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.DownArrow,
      command: 'EditorCompletion.focusNext',
      when: 'focus.editorCompletions',
    },
    {
      key: KeyCode.UpArrow,
      command: 'EditorCompletion.focusPrevious',
      when: 'focus.editorCompletions',
    },
    {
      key: KeyCode.Enter,
      command: 'EditorCompletion.selectCurrent',
      when: 'focus.editorCompletions',
    },
    {
      key: KeyCode.Escape,
      command: 'Editor.closeCompletion',
      when: 'focus.editorCompletions',
    },
  ]
}
