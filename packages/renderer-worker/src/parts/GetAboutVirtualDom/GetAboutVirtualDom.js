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
      className: 'InfoRow',
      childCount: 2,
    },
    text('Product Name '),
    text(productName),
    {
      type: VirtualDomElements.Div,
      className: 'InfoRow',
      childCount: 2,
    },
    text('Product Version '),
    text(version),
  ]
  return dom
}
