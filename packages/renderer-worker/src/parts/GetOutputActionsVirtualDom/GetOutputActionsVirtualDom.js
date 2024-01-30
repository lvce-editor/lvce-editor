import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getOutputActionsVirtualDom = (actions) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'OutputAction',
    },
  ]
}
