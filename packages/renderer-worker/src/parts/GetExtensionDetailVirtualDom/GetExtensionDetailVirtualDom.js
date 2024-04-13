import * as GetExtensionDetailHeaderVirtualDom from '../GetExtensionDetailHeaderVirtualDom/GetExtensionDetailHeaderVirtualDom.js'
import * as GetMarkdownVirtualDom from '../GetMarkdownVirtualDom/GetMarkdownVirtualDom.js'
import * as GetTotalChildCount from '../GetTotalChildCount/GetTotalChildCount.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'

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
      role: AriaRoles.Document,
      onContextMenu: DomEventListenerFunctions.HandleReadmeContextMenu,
      childCount,
    },
    ...markdownDom,
  ]
  return dom
}
