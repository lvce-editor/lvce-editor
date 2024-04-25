import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getPrimaryButtonVirtualDom = (message, onClick) => {
  return [
    {
      type: VirtualDomElements.Button,
      className: `${ClassNames.Button} ${ClassNames.ButtonPrimary}`,
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
      className: `${ClassNames.Button} ${ClassNames.ButtonSecondary}`,
      onClick,
      childCount: 1,
    },
    text(message),
  ]
}
