import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as Logger from '../Logger/Logger.js'
import { div } from '../VirtualDomHelpers/VirtualDomHelpers.js'

/**
 * @enum {string}
 */
const ClassNames = {
  KeyBindingsTableRow: 'KeyBindingsTableRow',
}

const getExtraProps = (flags) => {
  switch (flags) {
    case ActivityBarItemFlags.Tab:
      return {
        role: 'tab',
      }
    case ActivityBarItemFlags.Button:
      return {
        role: 'button',
        ariaHasPopup: true,
      }
    default:
      Logger.warn(`unknown activity bar item flags ${item.flags}`)
      return {}
  }
}

const createActivityBarItem = (item, isSelected) => {
  const isTab = item.flags === ActivityBarItemFlags.Tab
  const role = isTab ? 'tab' : 'button'
  const ariaSelected = isTab ? isSelected : undefined

  if (isSelected) {
    return [
      div(
        {
          className: 'ActivityBarItem ActivityBarItemSelected',
          ariaLabel: '',
          title: item.title,
          role,
          ariaSelected,
        },
        1
      ),
      div({
        className: 'MaskIcon',
        role: 'none',
        maskImage: item.icon,
      }),
    ]
  }
  return [
    div(
      {
        className: 'ActivityBarItem',
        ariaLabel: '',
        title: item.title,
        maskImage: item.icon,
        role,
        ariaSelected,
      },
      0
    ),
  ]
}

export const getVirtualDom = (visibleItems, selectedIndex) => {
  const dom = []
  for (let i = 0; i < visibleItems.length; i++) {
    const isSelected = i === selectedIndex
    const item = visibleItems[i]
    dom.push(...createActivityBarItem(item, isSelected))
  }
  return dom
}
