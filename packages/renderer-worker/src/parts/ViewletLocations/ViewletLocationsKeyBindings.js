export const getKeyBindings = () => {
  return [
    {
      key: 'ArrowDown',
      command: 'Locations.focusNext',
      when: 'focus.locationList',
    },
    {
      key: 'ArrowUp',
      command: 'Locations.focusPrevious',
      when: 'focus.locationList',
    },
    {
      key: 'Home',
      command: 'Locations.focusFirst',
      when: 'focus.locationList',
    },
    {
      key: 'End',
      command: 'Locations.focusLast',
      when: 'focus.locationList',
    },
    {
      key: 'Enter',
      command: 'Locations.selectCurrent',
      when: 'focus.locationList',
    },
  ]
}
