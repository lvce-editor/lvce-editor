import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.js'
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
  const marginTop = flags & ActivityBarItemFlags.MarginTop
  let className = ClassNames.ActivityBarItem
  if (isFocused) {
    className += ' ' + ClassNames.FocusOutline
  }
  if (marginTop) {
    className += ' ' + ClassNames.MarginTopAuto
  }
  if (isSelected) {
    className += ' ' + ClassNames.ActivityBarItemSelected
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
      GetIconVirtualDom.getIconVirtualDom(icon),
    ]
  }

  // TODO support progress on selected activity bar item
  if (isProgress) {
    className += ' ' + ClassNames.ActivityBarItemNested
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
        className: ClassNames.Icon,
        role: AriaRoles.None,
        childCount: 0,
        maskImage: icon,
      },
      {
        type: VirtualDomElements.Div,
        className: ClassNames.Badge,
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: ClassNames.BadgeContent,
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: ClassNames.Icon,
        maskImage: 'Progress',
      },
    ]
  }

  return [
    {
      type: VirtualDomElements.Div,
      className: `${className} Icon${icon}`,
      ariaLabel: '',
      title,
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
