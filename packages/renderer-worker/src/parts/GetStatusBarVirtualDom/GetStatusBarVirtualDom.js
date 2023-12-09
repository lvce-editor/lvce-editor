import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getStatusBarItemVirtualDom = (statusBarItem) => {
  const { tooltip, icon } = statusBarItem
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: 'StatusBarItem',
      role: AriaRoles.Button,
      tabIndex: -1,
      title: tooltip,
      childCount: 1,
    },
    text(statusBarItem.text),
  )
  return dom
}

export const getStatusBarVirtualDom = (statusBarItemsLeft, statusBarItemsRight) => {
  const dom = []
  if (statusBarItemsLeft.length > 0) {
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: 'StatusBarItemsLeft',
        childCount: statusBarItemsLeft.length,
      },
      ...statusBarItemsLeft.flatMap(getStatusBarItemVirtualDom),
    )
  }
  if (statusBarItemsRight.length > 0) {
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: 'StatusBarItemsRight',
        childCount: statusBarItemsRight.length,
      },
      ...statusBarItemsRight.flatMap(getStatusBarItemVirtualDom),
    )
  }
  return dom
}
