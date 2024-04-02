import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getItemVirtualDom = (item) => {
  const { keyboardShortCut, label, icon } = item
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'TitleBarTopLevelEntry',
      ariaHasPopup: true,
      ariaExpanded: true,
      role: 'menuitem',
      childCount: 1,
      ariaKeyShortcuts: keyboardShortCut,
    },
    text(label),
  ]
  return dom
}

export const getTitleBarMenuBarVirtualDom = (visibleItems) => {
  const dom = visibleItems.flatMap(getItemVirtualDom)
  return dom
}
