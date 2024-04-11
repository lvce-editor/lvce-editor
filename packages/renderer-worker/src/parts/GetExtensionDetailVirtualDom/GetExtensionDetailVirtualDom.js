import * as GetExtensionDetailHeaderVirtualDom from '../GetExtensionDetailHeaderVirtualDom/GetExtensionDetailHeaderVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as GetMarkdownVirtualDom from '../GetMarkdownVirtualDom/GetMarkdownVirtualDom.js'

export const getExtensionDetailVirtualDom = (extensionDetail, sanitizedReadmeHtml) => {
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
    },
    ...GetMarkdownVirtualDom.getMarkdownVirtualDom(sanitizedReadmeHtml),
  ]
  return dom
}
