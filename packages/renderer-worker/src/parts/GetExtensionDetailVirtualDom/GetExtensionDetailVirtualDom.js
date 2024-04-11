import * as GetExtensionDetailHeaderVirtualDom from '../GetExtensionDetailHeaderVirtualDom/GetExtensionDetailHeaderVirtualDom.js'
import * as GetMarkdownVirtualDom from '../GetMarkdownVirtualDom/GetMarkdownVirtualDom.js'
import * as GetTotalChildCount from '../GetTotalChildCount/GetTotalChildCount.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getExtensionDetailVirtualDom = (extensionDetail, sanitizedReadmeHtml) => {
  const markdownDom = GetMarkdownVirtualDom.getMarkdownVirtualDom(sanitizedReadmeHtml)
  const childCount = GetTotalChildCount.getTotalChildCount(markdownDom, 0)
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet ExtensionDetail',
      childCount: 2,
    },

    ...GetExtensionDetailHeaderVirtualDom.getExtensionDetailHeaderVirtualDom(extensionDetail),
    {
      type: VirtualDomElements.Div,
      className: 'Markdown',
      role: 'document',
      onContextMenu: 'handleReadmeContextMenu',
      childCount,
    },
    ...markdownDom,
  ]
  return dom
}
