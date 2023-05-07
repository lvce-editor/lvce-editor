import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import { div } from '../VirtualDomHelpers/VirtualDomHelpers.js'

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
      div(
        {
          className,
          ariaLabel: '',
          title,
          role,
          ariaSelected,
        },
        1
      ),
      div({
        className: 'MaskIcon',
        role: 'none',
        maskImage: icon,
      }),
    ]
  }
  return [
    div(
      {
        className,
        ariaLabel: '',
        title,
        maskImage: icon,
        role,
        ariaSelected,
      },
      0
    ),
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
