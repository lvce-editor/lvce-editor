import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as EmptySourceControlButtons from '../EmptySourceControlButtons/EmptySourceControlButton.js'
import * as GetBadgeVirtualDom from '../GetBadgeVirtualDom/GetBadgeVirtualDom.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.js'
import * as GetSplitButtonVirtualDom from '../GetSplitButtonVirtualDom/GetSplitButtonVirtualDom.js'
import * as TreeItemPadding from '../TreeItemPadding/TreeItemPadding.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getLabelClassName = (decorationStrikeThrough) => {
  let className = ClassNames.Label + ' Grow'
  if (decorationStrikeThrough) {
    className += ` ${ClassNames.StrikeThrough}`
  }
  return className
}

const addButtons = (dom, buttons) => {
  if (buttons === EmptySourceControlButtons.emptySourceControlButtons) {
    return
  }
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
      GetIconVirtualDom.getIconVirtualDom(icon, VirtualDomElements.Span),
    )
  }
}

const createItemDirectory = (item) => {
  const { posInSet, setSize, icon, label, badgeCount, decorationStrikeThrough, type, buttons } = item
  const labelClassName = getLabelClassName(decorationStrikeThrough)
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.TreeItem,
      role: AriaRoles.TreeItem,
      ariaExpanded: type === DirentType.DirectoryExpanded,
      ariaPosInSet: posInSet,
      ariaSetSize: setSize,
      childCount: 3,
      paddingLeft: TreeItemPadding.PaddingLeft,
      paddingRight: TreeItemPadding.PaddingRight,
    },
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.Chevron} MaskIcon${icon}`,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: labelClassName,
      childCount: 1,
    },
    text(label),
  ]
  addButtons(dom, buttons)
  dom.push(...GetBadgeVirtualDom.getBadgeVirtualDom(ClassNames.SourceControlBadge, badgeCount))
  return dom
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
  addButtons(dom, buttons)
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

export const getSourceControlItemsVirtualDom = (items, splitButtonEnabled) => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.SourceControlHeader,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Input,
      className: ClassNames.InputBox,
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: "Message (Enter) to commit on 'master'",
      ariaLabel: 'Source Control Input',
      childCount: 0,
    },
  )
  if (splitButtonEnabled) {
    const hasItems = items.length > 0
    dom.push(...GetSplitButtonVirtualDom.getSourceControlItemsVirtualDom(hasItems, 'Commit'))
  }
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.SourceControlItems,
      role: 'tree',
      childCount: items.length,
    },
    ...items.flatMap(createItem),
  )
  return dom
}
