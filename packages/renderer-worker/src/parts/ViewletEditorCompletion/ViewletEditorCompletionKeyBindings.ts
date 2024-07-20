import * as KeyCode from '../KeyCode/KeyCode.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.DownArrow,
      command: 'EditorCompletion.focusNext',
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      key: KeyCode.UpArrow,
      command: 'EditorCompletion.focusPrevious',
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      key: KeyCode.Enter,
      command: 'EditorCompletion.selectCurrent',
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      key: KeyCode.Escape,
      command: 'Editor.closeCompletion',
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      key: KeyCode.End,
      command: 'EditorCompletion.focusLast',
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      key: KeyCode.Home,
      command: 'EditorCompletion.focusFirst',
      when: WhenExpression.FocusEditorCompletions,
    },
  ]
}
