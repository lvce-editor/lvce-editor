import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getOptionVirtualDom = (option) => {
  return [
    {
      type: VirtualDomElements.Option,
      className: ClassNames.Option,
      childCount: 1,
    },
    text(option),
  ]
}

export const getActionSelectVirtualDom = (action) => {
  // @ts-ignore
  const { id, options } = action
  return [
    {
      type: VirtualDomElements.Select,
      className: ClassNames.Select,
      childCount: options.length,
    },
    ...options.flatMap(getOptionVirtualDom),
  ]
}
