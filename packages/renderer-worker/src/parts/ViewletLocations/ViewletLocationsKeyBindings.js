import * as KeyCode from '../KeyCode/KeyCode.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.DownArrow,
      command: 'Locations.focusNext',
      when: WhenExpression.FocusLocationList,
    },
    {
      key: KeyCode.UpArrow,
      command: 'Locations.focusPrevious',
      when: WhenExpression.FocusLocationList,
    },
    {
      key: KeyCode.Home,
      command: 'Locations.focusFirst',
      when: WhenExpression.FocusLocationList,
    },
    {
      key: KeyCode.End,
      command: 'Locations.focusLast',
      when: WhenExpression.FocusLocationList,
    },
    {
      key: KeyCode.Enter,
      command: 'Locations.selectCurrent',
      when: WhenExpression.FocusLocationList,
    },
  ]
}
