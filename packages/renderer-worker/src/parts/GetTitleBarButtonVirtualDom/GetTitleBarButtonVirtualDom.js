import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const createTitleBarButton = (button) => {
  const { id, icon, label } = button
  const dom = [
    {
      type: VirtualDomElements.Button,
      className: `TitleBarButton TitleBarButton${id}`,
      ariaLabel: label,
      childCount: 1,
    },
    GetIconVirtualDom.getIconVirtualDom(icon, VirtualDomElements.I),
  ]
  return dom
}
