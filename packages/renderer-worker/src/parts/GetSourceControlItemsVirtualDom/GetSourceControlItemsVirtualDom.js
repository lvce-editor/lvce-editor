import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as EmptySourceControlButtons from '../EmptySourceControlButtons/EmptySourceControlButton.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'
import * as GetBadgeVirtualDom from '../GetBadgeVirtualDom/GetBadgeVirtualDom.js'

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

const createItemDirectory = (item) => {
  const { posInSet, setSize, icon, label, badgeCount, decorationStrikeThrough, type } = item
  const labelClassName = getLabelClassName(decorationStrikeThrough)
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.TreeItem,
      role: AriaRoles.TreeItem,
      ariaExpanded: type === DirentType.DirectoryExpanded,
      ariaPosInSet: posInSet,
      ariaSetSize: setSize,
      childCount: 3,
      paddingLeft: '1rem',
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
    ...GetBadgeVirtualDom.getBadgeVirtualDom(ClassNames.SourceControlBadge, badgeCount),
  ]
}

const createItemOther = (item) => {
  const { posInSet, setSize, icon, file, label, decorationIcon, decorationIconTitle, decorationStrikeThrough, detail, buttons } = item
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
  if (buttons !== EmptySourceControlButtons.emptySourceControlButtons) {
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

const createItem = (item) => {
  switch (item.type) {
    case DirentType.DirectoryExpanded:
    case DirentType.Directory:
      return createItemDirectory(item)
    default:
      return createItemOther(item)
  }
}

export const getSourceControlItemsVirtualDom = (items) => {
  return items.flatMap(createItem)
}
