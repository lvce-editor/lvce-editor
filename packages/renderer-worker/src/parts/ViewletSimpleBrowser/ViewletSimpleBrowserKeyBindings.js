import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

const getBrowserTabKeyBindings = (when) => {
  return [
    { key: KeyModifier.CtrlCmd | KeyCode.KeyF, command: 'SimpleBrowser.toggleFind', when },
    { key: KeyModifier.CtrlCmd | KeyCode.KeyL, command: 'SimpleBrowser.focusAddress', when },
    { key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyI, command: 'SimpleBrowser.toggleDevTools', when },
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
    ...getBrowserTabKeyBindings(WhenExpression.FocusSimpleBrowserFind),
    ...getBrowserTabKeyBindings(WhenExpression.FocusSimpleBrowserFindInput),
    { key: KeyCode.Escape, command: 'SimpleBrowser.closeFind', when: WhenExpression.FocusSimpleBrowserFindInput },
    { key: KeyCode.Escape, command: 'SimpleBrowser.closeFind', when: WhenExpression.FocusSimpleBrowserFind },
    { key: KeyCode.Enter, command: 'SimpleBrowser.findNext', when: WhenExpression.FocusSimpleBrowserFindInput },
    { key: KeyModifier.Shift | KeyCode.Enter, command: 'SimpleBrowser.findPrevious', when: WhenExpression.FocusSimpleBrowserFindInput },
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
      command: 'SimpleBrowser.escapeAddress',
      when: WhenExpression.FocusSimpleBrowserInput,
    },
  ]
}
