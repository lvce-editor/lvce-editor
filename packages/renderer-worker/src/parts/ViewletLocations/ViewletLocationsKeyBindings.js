import * as KeyCode from '../KeyCode/KeyCode.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.DownArrow,
      command: 'Locations.focusNext',
      when: 'focus.locationList',
    },
    {
      key: KeyCode.UpArrow,
      command: 'Locations.focusPrevious',
      when: 'focus.locationList',
    },
    {
      key: KeyCode.Home,
      command: 'Locations.focusFirst',
      when: 'focus.locationList',
    },
    {
      key: KeyCode.End,
      command: 'Locations.focusLast',
      when: 'focus.locationList',
    },
    {
      key: KeyCode.Enter,
      command: 'Locations.selectCurrent',
      when: 'focus.locationList',
    },
  ]
}
