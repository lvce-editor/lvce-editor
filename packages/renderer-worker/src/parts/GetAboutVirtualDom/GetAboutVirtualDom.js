import * as AboutStrings from '../AboutStrings/AboutStrings.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const infoRow = {
  type: VirtualDomElements.Div,
  className: ClassNames.InfoRow,
  childCount: 2,
}

export const getAboutVirtualDom = (productName, message) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.AboutContent,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.AboutContentWrapper,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.AboutContentLeft,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'AboutInfoIcon MaskIcon MaskIconInfo',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.AboutContentRight,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.AboutContentRightHeading,
      childCount: 1,
    },
    text(productName),
    infoRow,
    text(message),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.AboutButtons,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Button,
      childCount: 1,
    },
    text(AboutStrings.ok()),
    {
      type: VirtualDomElements.Button,
      childCount: 1,
    },
    text(AboutStrings.copy()),
  ]
  return dom
}
