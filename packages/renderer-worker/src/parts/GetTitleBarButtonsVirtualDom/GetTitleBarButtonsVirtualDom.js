import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetTitleBarButtonVirtualDom from '../GetTitleBarButtonVirtualDom/GetTitleBarButtonVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getTitleBarButtonsVirtualDom = (buttons) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet TitleBarButtons',
      childCount: buttons.length,
      onClick: DomEventListenerFunctions.HandleTitleBarButtonsClick,
    },
    ...buttons.flatMap(GetTitleBarButtonVirtualDom.createTitleBarButton),
  ]
  return dom
}
