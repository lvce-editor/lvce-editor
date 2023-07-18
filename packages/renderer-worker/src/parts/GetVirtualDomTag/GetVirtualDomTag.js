import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getVirtualDomTag = (text) => {
  switch (text) {
    case 'h1':
      return VirtualDomElements.H1
    case 'h2':
      return VirtualDomElements.H2
    case 'h3':
      return VirtualDomElements.H3
    case 'h4':
      return VirtualDomElements.H4
    case 'h5':
      return VirtualDomElements.H5
    case 'div':
      return VirtualDomElements.Div
    default:
      return VirtualDomElements.Div
  }
}
