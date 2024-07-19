import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getStatusBarItemVirtualDom = (statusBarItem) => {
  // @ts-ignore
  const { tooltip, icon } = statusBarItem
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.StatusBarItem,
      role: AriaRoles.Button,
      tabIndex: -1,
      title: tooltip,
      childCount: 1,
    },
    text(statusBarItem.text),
  )
  return dom
}

export const getStatusBarItemsVirtualDom = (items, className) => {
  return [
    {
      type: VirtualDomElements.Div,
      className,
      childCount: items.length,
    },
    ...items.flatMap(getStatusBarItemVirtualDom),
  ]
}
