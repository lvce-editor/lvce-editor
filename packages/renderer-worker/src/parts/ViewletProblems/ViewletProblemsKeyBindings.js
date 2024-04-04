import * as KeyCode from '../KeyCode/KeyCode.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.DownArrow,
      command: 'Problems.focusNext',
      when: WhenExpression.FocusProblems,
    },
    {
      key: KeyCode.UpArrow,
      command: 'Problems.focusPrevious',
      when: WhenExpression.FocusProblems,
    },
    {
      key: KeyCode.Home,
      command: 'Problems.focusFirst',
      when: WhenExpression.FocusProblems,
    },
    {
      key: KeyCode.PageUp,
      command: 'Problems.focusFirst',
      when: WhenExpression.FocusProblems,
    },
    {
      key: KeyCode.PageDown,
      command: 'Problems.focusLast',
      when: WhenExpression.FocusProblems,
    },
    {
      key: KeyCode.End,
      command: 'Problems.focusLast',
      when: WhenExpression.FocusProblems,
    },
    {
      key: KeyCode.Space,
      command: 'Problems.selectCurrent',
      when: WhenExpression.FocusProblems,
    },
    {
      key: KeyCode.Home,
      command: 'Problems.focusFirst',
      when: WhenExpression.FocusProblems,
    },
    {
      key: KeyCode.End,
      command: 'Problems.focusLast',
      when: WhenExpression.FocusProblems,
    },
    {
      key: KeyCode.LeftArrow,
      command: 'Problems.handleArrowLeft',
      when: WhenExpression.FocusProblems,
    },
    {
      key: KeyCode.RightArrow,
      command: 'Problems.handleArrowRight',
      when: WhenExpression.FocusProblems,
    },
  ]
}
