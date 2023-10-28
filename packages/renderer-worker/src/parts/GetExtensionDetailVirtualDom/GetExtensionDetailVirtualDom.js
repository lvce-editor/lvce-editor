import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getExtensionDetailVirtualDom = (extensionDetail) => {
  const { name, iconSrc, description } = extensionDetail
  const dom = [
    {
      type: VirtualDomElements.Img,
      className: 'ExtensionDetailIcon',
      alt: '',
      draggable: false,
      childCount: 0,
      src: iconSrc,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ExtensionDetailHeaderDetails',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ExtensionDetailName',
      childCount: 1,
    },
    text(name),
    {
      type: VirtualDomElements.Div,
      className: 'ExtensionDetailDescription',
      childCount: 1,
    },
    text(description),
  ]
  return dom
}
