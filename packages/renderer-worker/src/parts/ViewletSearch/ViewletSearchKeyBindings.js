import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.DownArrow,
      command: 'Search.focusNext',
      when: 'focus.SearchResults',
    },
    {
      key: KeyCode.UpArrow,
      command: 'Search.focusPrevious',
      when: 'focus.SearchResults',
    },
    {
      key: KeyCode.Delete,
      command: 'Search.dismissItem',
      when: 'focus.SearchResults',
    },
    {
      key: KeyCode.Home,
      command: 'Search.focusFirst',
      when: 'focus.SearchResults',
    },
    {
      key: KeyCode.End,
      command: 'Search.focusLast',
      when: 'focus.SearchResults',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyC,
      command: 'Search.copy',
      when: 'focus.SearchResults',
    },
  ]
}
