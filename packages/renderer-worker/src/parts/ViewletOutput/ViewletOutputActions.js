import * as Icon from '../Icon/Icon.js'

export const getActions = () => {
  return [
    {
      type: 'select',
      id: 'output',
    },
    {
      type: 'button',
      id: 'clear output',
      icon: Icon.ClearAll,
    },
    {
      type: 'button',
      id: 'Turn auto scrolling off',
      icon: Icon.Blank,
    },
    {
      type: 'button',
      id: 'open output log file',
      icon: Icon.Blank,
    },
  ]
}
