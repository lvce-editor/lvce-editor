import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.DownArrow,
      command: 'Search.focusNext',
      when: WhenExpression.FocusSearchResults,
    },
    {
      key: KeyCode.UpArrow,
      command: 'Search.focusPrevious',
      when: WhenExpression.FocusSearchResults,
    },
    {
      key: KeyCode.Delete,
      command: 'Search.dismissItem',
      when: WhenExpression.FocusSearchResults,
    },
    {
      key: KeyCode.Home,
      command: 'Search.focusFirst',
      when: WhenExpression.FocusSearchResults,
    },
    {
      key: KeyCode.End,
      command: 'Search.focusLast',
      when: WhenExpression.FocusSearchResults,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyC,
      command: 'Search.copy',
      when: WhenExpression.FocusSearchResults,
    },
    {
      key: KeyCode.Tab,
      command: 'Search.focusSearchValueNext',
      when: WhenExpression.FocusSearchInput,
    },
    {
      key: KeyModifier.Shift | KeyCode.Tab,
      command: 'Search.focusReplaceValuePrevious',
      when: WhenExpression.FocusSearchReplaceInput,
    },
    {
      key: KeyCode.Tab,
      command: 'Search.focusReplaceValueNext',
      when: WhenExpression.FocusSearchReplaceInput,
    },
    {
      key: KeyModifier.Shift | KeyCode.Tab,
      command: 'Search.focusMatchCasePrevious',
      when: WhenExpression.FocusMatchCase,
    },
    {
      key: KeyCode.Tab,
      command: 'Search.focusRegexNext',
      when: WhenExpression.FocusRegex,
    },
    {
      key: KeyModifier.Shift | KeyCode.Tab,
      command: 'Search.focusPreserveCasePrevious',
      when: WhenExpression.FocusPreserveCase,
    },
    {
      key: KeyCode.Enter,
      command: 'Search.submit',
      when: WhenExpression.FocusSearchInput,
    },
    {
      key: KeyCode.Enter,
      command: 'Search.submit',
      when: WhenExpression.FocusSearchReplaceInput,
    },
  ]
}
