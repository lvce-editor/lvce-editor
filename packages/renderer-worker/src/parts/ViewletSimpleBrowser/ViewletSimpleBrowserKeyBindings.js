import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

const getBrowserTabKeyBindings = (when) => {
  return [
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyW,
      command: 'SimpleBrowser.closeCurrentTab',
      when,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyT,
      command: 'SimpleBrowser.createNewTab',
      when,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyH,
      command: 'SimpleBrowser.openHistory',
      when,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Tab,
      command: 'SimpleBrowser.focusNextTab',
      when,
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Tab,
      command: 'SimpleBrowser.focusPreviousTab',
      when,
    },
  ]
}

export const getKeyBindings = () => {
  return [
    ...getBrowserTabKeyBindings(WhenExpression.FocusSimpleBrowserInput),
    ...getBrowserTabKeyBindings(WhenExpression.FocusSimpleBrowser),
    {
      key: KeyCode.DownArrow,
      command: 'SimpleBrowser.selectNextSuggestion',
      when: WhenExpression.FocusSimpleBrowserInput,
    },
    {
      key: KeyCode.Enter,
      command: 'SimpleBrowser.go',
      when: WhenExpression.FocusSimpleBrowserInput,
    },
    {
      key: KeyCode.UpArrow,
      command: 'SimpleBrowser.selectPreviousSuggestion',
      when: WhenExpression.FocusSimpleBrowserInput,
    },
    {
      key: KeyCode.Escape,
      command: 'SimpleBrowser.closeSuggestions',
      when: WhenExpression.FocusSimpleBrowserInput,
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyI,
      command: 'Developer.toggleDeveloperTools',
      when: WhenExpression.FocusSimpleBrowser,
    },
  ]
}
