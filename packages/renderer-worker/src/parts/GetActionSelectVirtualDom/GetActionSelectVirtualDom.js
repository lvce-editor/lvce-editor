import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getActionSelectVirtualDom = (action) => {
  return [
    {
      type: VirtualDomElements.Select,
      className: 'Select',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Option,
      className: 'Option',
      childCount: 1,
    },
    text('test'),
  ]
}
