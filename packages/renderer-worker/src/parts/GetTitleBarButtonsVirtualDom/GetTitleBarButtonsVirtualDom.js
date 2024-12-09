import * as GetTitleBarButtonVirtualDom from '../GetTitleBarButtonVirtualDom/GetTitleBarButtonVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getTitleBarButtonsVirtualDom = (buttons) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet TitleBarButtons',
      childCount: buttons.length,
    },
    ...buttons.flatMap(GetTitleBarButtonVirtualDom.createTitleBarButton),
  ]
  return dom
}
