import * as AboutStrings from '../AboutStrings/AboutStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getAboutVirtualDom = (productName, version) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'AboutContent',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'AboutContentWrapper',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'AboutContentLeft',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'AboutInfoIcon MaskIcon MaskIconInfo',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'AboutContentRight',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'AboutContentRightHeading',
      childCount: 1,
    },
    text(productName),
    {
      type: VirtualDomElements.Div,
      className: 'InfoRow',
      childCount: 2,
    },
    text(`${AboutStrings.version()} `),
    text(version),
    {
      type: VirtualDomElements.Div,
      className: 'AboutButtons',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Button,
      className: 'Button ButtonSecondary',
      childCount: 1,
    },
    text(AboutStrings.ok()),
    {
      type: VirtualDomElements.Button,
      childCount: 1,
      className: 'Button ButtonPrimary',
    },
    text(AboutStrings.copy()),
  ]
  return dom
}
