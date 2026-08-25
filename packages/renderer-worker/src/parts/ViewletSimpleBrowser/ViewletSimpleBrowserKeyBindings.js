import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.DownArrow,
      command: 'SimpleBrowser.selectNextSuggestion',
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
