import * as GetAboutContentVirtualDom from '../GetAboutContentVirtualDom/GetAboutContentVirtualDom.js'
import * as GetDialogVirtualDom from '../GetDialogVirtualDom/GetDialogVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getAboutVirtualDom = (productName, lines, closeMessage, okMessage, copyMessage, infoMessage) => {
  const content = GetAboutContentVirtualDom.getAboutContentVirtualDom(lines)
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet About',
      onContextMenu: 'handleContextMenu',
      childCount: 1,
    },
    ...GetDialogVirtualDom.getDialogVirtualDom(content, closeMessage, infoMessage, okMessage, copyMessage, productName),
  ]
}
