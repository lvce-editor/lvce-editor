import * as GetExtensionDetailHeaderVirtualDom from '../GetExtensionDetailHeaderVirtualDom/GetExtensionDetailHeaderVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getExtensionDetailVirtualDom = (extensionDetail) => {
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
  ]
  return dom
}
