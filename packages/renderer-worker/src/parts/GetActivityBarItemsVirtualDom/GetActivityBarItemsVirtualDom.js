import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const createActivityBarItem = (item, isSelected, isFocused) => {
  const { flags, title, icon } = item
  const isTab = flags === ActivityBarItemFlags.Tab
  const role = isTab ? 'tab' : 'button'
  const ariaSelected = isTab ? isSelected : undefined
  let className = 'ActivityBarItem'
  if (isFocused) {
    className += ' FocusOutline'
  }
  if (isSelected) {
    className += ' ActivityBarItemSelected'
    return [
      {
        type: VirtualDomElements.Div,
        className,
        ariaLabel: '',
        title,
        role,
        ariaSelected,
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'MaskIcon',
        role: 'none',
        maskImage: icon,
        childCount: 0,
      },
    ]
  }
  return [
    {
      type: VirtualDomElements.Div,
      className,
      ariaLabel: '',
      title,
      maskImage: icon,
      role,
      ariaSelected,
      childCount: 0,
    },
  ]
}

export const getVirtualDom = (visibleItems, selectedIndex, focusedIndex) => {
  const dom = []
  for (let i = 0; i < visibleItems.length; i++) {
    const isSelected = i === selectedIndex
    const isFocused = i === focusedIndex
    const item = visibleItems[i]
    dom.push(...createActivityBarItem(item, isSelected, isFocused))
  }
  return dom
}
