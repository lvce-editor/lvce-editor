import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DragData from '../DragData/DragData.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as TabFlags from '../TabFlags/TabFlags.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getIconDom = (icon) => {
  if (icon.startsWith('MaskIcon')) {
    return {
      type: VirtualDomElements.Div,
      className: `TabIcon ${icon}`,
      childCount: 0,
    }
  }
  return GetFileIconVirtualDom.getFileIconVirtualDom(icon)
}

export const getTabDom = (tab) => {
  const { icon, tabWidth, uri, flags, uid, isActive, fixedWidth, label } = tab
  let tabClassName = ClassNames.MainTab
  if (isActive) {
    tabClassName += ' ' + ClassNames.MainTabSelected
  }
  const isDirty = flags & TabFlags.Dirty
  // @ts-ignore
  const isHovered = flags & TabFlags.Hovered
  const actualTabWidth = fixedWidth || tabWidth
  const tabElement = {
    type: VirtualDomElements.Div,
    className: tabClassName,
    role: AriaRoles.Tab,
    draggable: true,
    width: actualTabWidth,
    ariaSelected: isActive,
    title: uri,
    childCount: 2,
    'data-dragUid': uid,
  }
  DragData.set(uid, {
    type: 'file',
    uri,
  })
  const dom = []

  dom.push(
    tabElement,
    getIconDom(icon),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.TabLabel,
      childCount: 1,
    },
    text(label),
  )

  if (isDirty) {
    tabElement.childCount++
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: ClassNames.EditorTabCloseButton,
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'MaskIcon MaskIconCircleFilled',
        childCount: 0,
      },
    )
  } else {
    tabElement.childCount++
    dom.push(
      {
        type: VirtualDomElements.Button,
        className: ClassNames.EditorTabCloseButton,
        title: 'Close',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'MaskIcon MaskIconClose',
        childCount: 0,
      },
    )
  }
  return dom
}
