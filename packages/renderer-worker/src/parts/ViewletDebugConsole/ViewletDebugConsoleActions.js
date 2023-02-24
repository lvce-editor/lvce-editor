import * as Icon from '../Icon/Icon.js'

export const getActions = () => {
  return [
    {
      type: 'filter',
      id: '',
    },
    {
      type: 'button',
      id: 'Clear Console',
      icon: Icon.ClearAll,
    },
  ]
}
