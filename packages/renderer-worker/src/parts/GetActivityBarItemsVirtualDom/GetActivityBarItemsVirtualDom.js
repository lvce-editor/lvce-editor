import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Icon from '../Icon/Icon.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getAriaSelected = (isTab, isSelected) => {
  if (!isTab) {
    return undefined
  }
  return Boolean(isSelected)
}

const createActivityBarItem = (item) => {
  const { flags, title, icon } = item
  const isTab = flags & ActivityBarItemFlags.Tab
  const isSelected = flags & ActivityBarItemFlags.Selected
  const isFocused = flags & ActivityBarItemFlags.Focused
  const isProgress = flags & ActivityBarItemFlags.Progress
  const role = isTab ? AriaRoles.Tab : AriaRoles.Button
  const ariaSelected = getAriaSelected(isTab, isSelected)
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
        role: AriaRoles.None,
        maskImage: icon,
        childCount: 0,
      },
    ]
  }

  // TODO support progress on selected activity bar item
  if (isProgress) {
    className += ' ActivityBarItemNested'
    return [
      {
        type: VirtualDomElements.Div,
        className,
        ariaLabel: '',
        title,
        role,
        ariaSelected,
        childCount: 2,
      },
      {
        type: VirtualDomElements.Div,
        className: 'MaskIcon',
        role: AriaRoles.None,
        childCount: 0,
        maskImage: icon,
      },
      {
        type: VirtualDomElements.Div,
        className: 'Badge',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'BadgeContent',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'MaskIcon',
        maskImage: Icon.Progress,
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

export const getVirtualDom = (visibleItems) => {
  const dom = visibleItems.flatMap(createActivityBarItem)
  return dom
}
