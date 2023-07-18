import * as GetMarkdownVirtualDom from '../GetMarkdownVirtualDom/GetMarkdownVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getHoverVirtualDom = (sanitizedHtml, documentation) => {
  const markdownDom = GetMarkdownVirtualDom.getMarkdownVirtualDom(sanitizedHtml)
  return [
    {
      type: VirtualDomElements.Div,
      className: 'HoverDisplayString',
      childCount: 1,
    },
    ...markdownDom,
    {
      type: VirtualDomElements.Div,
      className: 'HoverDocumentation',
      childCount: 1,
    },
    text(documentation),
  ]
}
