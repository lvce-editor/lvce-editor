import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.RightArrow,
      command: 'Explorer.handleArrowRight',
      when: 'focus.Explorer',
    },
    {
      key: KeyCode.LeftArrow,
      command: 'Explorer.handleArrowLeft',
      when: 'focus.Explorer',
    },
    {
      key: KeyCode.Home,
      command: 'Explorer.focusFirst',
      when: 'focus.Explorer',
    },
    {
      key: KeyCode.End,
      command: 'Explorer.focusLast',
      when: 'focus.Explorer',
    },
    {
      key: KeyCode.UpArrow,
      command: 'Explorer.focusPrevious',
      when: 'focus.Explorer',
    },
    {
      key: KeyCode.DownArrow,
      command: 'Explorer.focusNext',
      when: 'focus.Explorer',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Star,
      command: 'Explorer.expandAll',
      when: 'focus.Explorer',
    },
    {
      key: KeyModifier.Alt | KeyCode.RightArrow,
      command: 'Explorer.expandRecursively',
      when: 'focus.Explorer',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.LeftArrow,
      command: 'Explorer.collapseAll',
      when: 'focus.Explorer',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyV,
      command: 'Explorer.handlePaste',
      when: 'focus.Explorer',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyC,
      command: 'Explorer.handleCopy',
      when: 'focus.Explorer',
    },
    {
      key: KeyCode.F2,
      command: 'Explorer.rename',
      when: 'focus.Explorer',
    },
    {
      key: KeyCode.Escape,
      command: 'Explorer.cancelEdit',
      when: 'focus.ExplorerEditBox',
    },
    {
      key: KeyCode.Enter,
      command: 'Explorer.acceptEdit',
      when: 'focus.ExplorerEditBox',
    },
    {
      key: KeyCode.Delete,
      command: 'Explorer.removeDirent',
      when: 'focus.Explorer',
    },
    {
      key: KeyCode.Escape,
      command: 'Explorer.focusNone',
      when: 'focus.Explorer',
    },
    {
      key: KeyCode.Space,
      command: 'Explorer.handleClickCurrentButKeepFocus',
      when: 'focus.Explorer',
    },
    {
      key: KeyCode.Enter,
      command: 'Explorer.handleClickCurrent',
      when: 'focus.Explorer',
    },
  ]
}
