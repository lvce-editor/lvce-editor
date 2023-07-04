import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const createTitleBarButton = (button) => {
  const { id, icon, label } = button
  const dom = [
    {
      type: VirtualDomElements.Button,
      className: `TitleBarButton TitleBarButton${id}`,
      ariaLabel: label,
      childCount: 1,
    },
    {
      type: VirtualDomElements.I,
      className: `MaskIcon ${icon}`,
      childCount: 0,
    },
  ]
  return dom
}

export const getTitleBarButtonsVirtualDom = (buttons) => {
  const dom = buttons.flatMap(createTitleBarButton)
  return dom
}
