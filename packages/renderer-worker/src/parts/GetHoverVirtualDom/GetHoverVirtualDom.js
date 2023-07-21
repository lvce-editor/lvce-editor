import * as GetMarkdownVirtualDom from '../GetMarkdownVirtualDom/GetMarkdownVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getLineCount = (dom) => {
  let depth = 1
  let lineCount = 0
  for (const element of dom) {
    depth += element.childCount - 1
    if (depth === 0) {
      lineCount++
    }
  }
  lineCount--
  return lineCount
}

export const getHoverVirtualDom = (sanitizedHtml, documentation) => {
  const markdownDom = GetMarkdownVirtualDom.getMarkdownVirtualDom(sanitizedHtml)
  const lineCount = getLineCount(markdownDom)
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'HoverDisplayString',
      childCount: lineCount,
    },
    ...markdownDom,
  ]
  if (documentation) {
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: 'HoverDocumentation',
        childCount: 1,
      },
      text(documentation)
    )
  }
  return dom
}
