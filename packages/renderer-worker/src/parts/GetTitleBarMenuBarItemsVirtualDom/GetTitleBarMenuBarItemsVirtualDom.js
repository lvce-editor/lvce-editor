import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getItemVirtualDom = (item) => {
  const { keyboardShortCut, label, icon, isOpen, isFocused } = item
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: 'TitleBarTopLevelEntry',
    ariaHasPopup: true,
    ariaExpanded: isOpen,
    role: 'menuitem',
    childCount: 1,
    ariaKeyShortcuts: keyboardShortCut,
  })
  if (isOpen) {
    // @ts-ignore
    dom[0].ariaOwns = 'Menu-0'
  }
  if (isFocused) {
    dom[0].className += ' TitleBarEntryActive'
    // @ts-ignore
    dom[0].id = 'TitleBarEntryActive'
    dom.push({
      type: VirtualDomElements.Div,
      className: 'TitleBarTopLevelEntryLabel',
      childCount: 1,
    })
  }
  dom.push(text(label))
  return dom
}

export const getTitleBarMenuBarItemsVirtualDom = (visibleItems) => {
  const dom = visibleItems.flatMap(getItemVirtualDom)
  return dom
}
