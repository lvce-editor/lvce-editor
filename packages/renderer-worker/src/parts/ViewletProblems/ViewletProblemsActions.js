import * as Icon from '../Icon/Icon.js'

export const getActions = () => {
  return [
    {
      type: 'filter',
      id: '',
    },
    {
      type: 'button',
      id: 'Collapse All',
      icon: Icon.CollapseAll,
    },
    {
      type: 'button',
      id: 'View as table',
      icon: Icon.ListFlat,
    },
  ]
}
