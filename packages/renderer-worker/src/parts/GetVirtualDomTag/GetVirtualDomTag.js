import * as ElementTags from '../ElementTags/ElementTags.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getVirtualDomTag = (text) => {
  switch (text) {
    case ElementTags.H1:
      return VirtualDomElements.H1
    case ElementTags.H2:
      return VirtualDomElements.H2
    case ElementTags.H3:
      return VirtualDomElements.H3
    case ElementTags.H4:
      return VirtualDomElements.H4
    case ElementTags.H5:
      return VirtualDomElements.H5
    case ElementTags.Div:
      return VirtualDomElements.Div
    default:
      return VirtualDomElements.Div
  }
}
