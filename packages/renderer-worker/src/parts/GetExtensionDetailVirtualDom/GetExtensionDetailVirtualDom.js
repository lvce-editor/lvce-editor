import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetExtensionDetailHeaderVirtualDom from '../GetExtensionDetailHeaderVirtualDom/GetExtensionDetailHeaderVirtualDom.js'
import * as GetMarkdownVirtualDom from '../GetMarkdownVirtualDom/GetMarkdownVirtualDom.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetVirtualDomChildCount from '../GetVirtualDomChildCount/GetVirtualDomChildCount.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getExtensionDetailVirtualDom = (extensionDetail, sanitizedReadmeHtml) => {
  const markdownDom = GetMarkdownVirtualDom.getMarkdownVirtualDom(sanitizedReadmeHtml)
  const childCount = GetVirtualDomChildCount.getVirtualDomChildCount(markdownDom)
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet ExtensionDetail',
      childCount: childCount + 1,
    },

    ...GetExtensionDetailHeaderVirtualDom.getExtensionDetailHeaderVirtualDom(extensionDetail),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Markdown,
      role: AriaRoles.Document,
      onContextMenu: DomEventListenerFunctions.HandleReadmeContextMenu,
      childCount,
    },
    ...markdownDom,
  ]
  return dom
}
