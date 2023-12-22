import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

/**
 * @enum {string}
 */
const ClassNames = {
  Label: 'Label',
  StrikeThrough: 'StrikeThrough',
  TreeItem: 'TreeItem',
  Chevron: 'Chevron',
  SourceControlBadge: 'SourceControlBadge',
  ChevronRight: 'ChevronRight',
  LabelDetail: 'LabelDetail',
  SourceControlButton: 'SourceControlButton',
  DecorationIcon: 'DecorationIcon',
}

const getLabelClassName = (decorationStrikeThrough) => {
  let className = ClassNames.Label
  if (decorationStrikeThrough) {
    className += ` ${ClassNames.StrikeThrough}`
  }
  return className
}

const createItemDirectoryExpanded = (item) => {
  const { posInSet, setSize, icon, label, badgeCount, decorationStrikeThrough } = item
  const labelClassName = getLabelClassName(decorationStrikeThrough)
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.TreeItem,
      role: AriaRoles.TreeItem,
      ariaExpanded: true,
      ariaPosInSet: posInSet,
      ariaSetSize: setSize,
      childCount: 3,
      paddingLeft: '0.5rem',
      paddingRight: '12px',
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Chevron,
      childCount: 1,
    },
    GetIconVirtualDom.getIconVirtualDom(icon),
    {
      type: VirtualDomElements.Div,
      className: labelClassName,
      childCount: 1,
    },
    text(label),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.SourceControlBadge,
      childCount: 1,
    },
    text(badgeCount),
  ]
}

const createItemOther = (item, index, buttonIndex, buttons) => {
  const { posInSet, setSize, icon, file, label, decorationIcon, decorationIconTitle, decorationStrikeThrough, detail } = item
  const labelClassName = getLabelClassName(decorationStrikeThrough)
  /**
   * @type {any[]}
   */
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.TreeItem,
      role: AriaRoles.TreeItem,
      ariaPosInSet: posInSet,
      ariaSetSize: setSize,
      title: file,
      childCount: 3,
      paddingLeft: '1rem',
      paddingRight: '12px',
    },
    ...(icon === ClassNames.ChevronRight
      ? [
          {
            type: VirtualDomElements.Div,
            className: ClassNames.Chevron,
            childCount: 1,
          },
          GetIconVirtualDom.getIconVirtualDom(icon),
        ]
      : [GetFileIconVirtualDom.getFileIconVirtualDom(icon)]),
  )
  const labelDom = {
    type: VirtualDomElements.Div,
    className: labelClassName,
    childCount: 1,
  }
  dom.push(labelDom, text(label))

  if (detail) {
    labelDom.childCount++
    dom.push(
      {
        type: VirtualDomElements.Span,
        className: ClassNames.LabelDetail,
        childCount: 1,
      },
      text(detail),
    )
  }
  if (index === buttonIndex) {
    dom[0].childCount += buttons.length
    for (const button of buttons) {
      const { icon, label } = button
      dom.push(
        {
          type: VirtualDomElements.Button,
          className: ClassNames.SourceControlButton,
          title: label,
          ariaLabel: label,
          childCount: 1,
        },
        {
          type: VirtualDomElements.Span,
          className: `MaskIcon MaskIcon${icon}`,
        },
      )
    }
  }
  dom.push({
    type: VirtualDomElements.Img,
    className: ClassNames.DecorationIcon,
    title: decorationIconTitle,
    src: decorationIcon,
    childCount: 0,
  })
  return dom
}

const createItem = (item, index, buttonIndex, buttons) => {
  const { type } = item
  if (type === DirentType.DirectoryExpanded) {
    return createItemDirectoryExpanded(item)
  }
  return createItemOther(item, index, buttonIndex, buttons)
}

export const getSourceControlItemsVirtualDom = (items, buttonIndex, buttons) => {
  const result = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    result.push(...createItem(item, i, buttonIndex, buttons))
  }
  return result
}
