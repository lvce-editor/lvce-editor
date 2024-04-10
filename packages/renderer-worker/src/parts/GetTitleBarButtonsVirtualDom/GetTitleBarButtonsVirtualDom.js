import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.js'

const createTitleBarButton = (button) => {
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

export const getTitleBarButtonsVirtualDom = (buttons) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet TitleBarButtons',
      childCount: buttons.length,
      onClick: 'handleTitleBarButtonsClick',
    },
    ...buttons.flatMap(createTitleBarButton),
  ]
  return dom
}
