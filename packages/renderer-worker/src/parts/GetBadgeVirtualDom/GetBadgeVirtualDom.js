import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getBadgeVirtualDom = (className, count) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: `Badge ${className}`,
      childCount: 1,
    },
    text(`${count}`),
  ]
}
