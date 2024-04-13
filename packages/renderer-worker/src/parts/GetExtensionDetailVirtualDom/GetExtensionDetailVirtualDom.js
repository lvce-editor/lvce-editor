import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetExtensionDetailHeaderVirtualDom from '../GetExtensionDetailHeaderVirtualDom/GetExtensionDetailHeaderVirtualDom.js'
import * as GetMarkdownVirtualDom from '../GetMarkdownVirtualDom/GetMarkdownVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getMarkdownChildCount = (markdownDom) => {
  const max = markdownDom.length - 1
  let stack = []
  for (let i = max; i >= 0; i--) {
    const element = markdownDom[i]
    console.log({ element, markdownDom, i })
    if (element.childCount > 0) {
      stack = stack.slice(element.childCount)
    }
    stack.unshift(element)
  }
  return stack.length
}

export const getExtensionDetailVirtualDom = (extensionDetail, sanitizedReadmeHtml) => {
  const markdownDom = GetMarkdownVirtualDom.getMarkdownVirtualDom(sanitizedReadmeHtml)
  const childCount = getMarkdownChildCount(markdownDom)
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet ExtensionDetail',
      childCount: childCount + 1,
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
