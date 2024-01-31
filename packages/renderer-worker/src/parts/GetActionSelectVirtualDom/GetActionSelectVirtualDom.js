import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getOptionVirtualDom = (option) => {
  return [
    {
      type: VirtualDomElements.Option,
      className: 'Option',
      childCount: 1,
    },
    text(option),
  ]
}

export const getActionSelectVirtualDom = (action) => {
  const { id, options } = action
  return [
    {
      type: VirtualDomElements.Select,
      className: 'Select',
      childCount: options.length,
    },
    ...options.flatMap(getOptionVirtualDom),
  ]
}
