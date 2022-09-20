import * as ElementTag from '../ElementTags/ElementTags.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getElementTag = (type) => {
  switch (type) {
    case VirtualDomElements.H1:
      return ElementTag.H1
    case VirtualDomElements.Div:
      return ElementTag.Div
    case VirtualDomElements.Kbd:
      return ElementTag.Kbd
    case VirtualDomElements.Table:
      return ElementTag.Table
    case VirtualDomElements.TBody:
      return ElementTag.TBody
    case VirtualDomElements.Th:
      return ElementTag.Th
    case VirtualDomElements.Td:
      return ElementTag.Td
    case VirtualDomElements.THead:
      return ElementTag.THead
    case VirtualDomElements.Tr:
      return ElementTag.Tr
    case VirtualDomElements.Input:
      return ElementTag.Input
    case VirtualDomElements.I:
      return ElementTag.I
    default:
      throw new Error(`element tag not found ${type}`)
  }
}
