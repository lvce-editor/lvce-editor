import { button, i } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const createTitleBarButton = (id, icon, label) => {
  const dom = [
    button(
      {
        className: `TitleBarButton TitleBarButtton${id}`,
        ariaLabel: label,
        id: `TitleBarButton${id}`,
      },
      1
    ),
    i(
      {
        className: `MaskIcon ${icon}`,
      },
      0
    ),
  ]
  return dom
}

export const getTitleBarButtonsVirtualDom = (buttons) => {
  const dom = buttons.flatMap(createTitleBarButton)
  return dom
}
