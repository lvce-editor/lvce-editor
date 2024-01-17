import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getPrimaryButtonVirtualDom = (message, onClick) => {
  return [
    {
      type: VirtualDomElements.Button,
      className: 'Button ButtonPrimary',
      onClick,
      childCount: 1,
    },
    text(message),
  ]
}

export const getSecondaryButtonVirtualDom = (message, onClick) => {
  return [
    {
      type: VirtualDomElements.Button,
      className: 'Button ButtonSecondary',
      onClick,
      childCount: 1,
    },
    text(message),
  ]
}
