import * as ElementTag from '../ElementTags/ElementTags.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getElementTag = (type) => {
  switch (type) {
    case VirtualDomElements.H1:
      return ElementTag.H1
    case VirtualDomElements.H2:
      return ElementTag.H2
    case VirtualDomElements.H3:
      return ElementTag.H3
    case VirtualDomElements.H4:
      return ElementTag.H4
    case VirtualDomElements.H5:
      return ElementTag.H5
    case VirtualDomElements.H6:
      return ElementTag.H6
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
    case VirtualDomElements.ColGroup:
      return ElementTag.ColGroup
    case VirtualDomElements.Col:
      return ElementTag.Col
    case VirtualDomElements.Button:
      return ElementTag.Button
    case VirtualDomElements.Span:
      return ElementTag.Span
    case VirtualDomElements.I:
      return ElementTag.I
    case VirtualDomElements.Img:
      return ElementTag.Img
    case VirtualDomElements.Ins:
      return ElementTag.Ins
    case VirtualDomElements.Del:
      return ElementTag.Del
    default:
      throw new Error(`element tag not found ${type}`)
  }
}
