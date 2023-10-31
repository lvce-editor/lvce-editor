import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getLabelClassName = (decorationStrikeThrough) => {
  let className = 'Label'
  if (decorationStrikeThrough) {
    className += ' StrikeThrough'
  }
  return className
}

const createItem = (item, index, buttonIndex, buttons) => {
  const { type, posInSet, setSize, icon, file, label, badgeCount, title, decorationIcon, decorationIconTitle, decorationStrikeThrough, detail } = item
  const labelClassName = getLabelClassName(decorationStrikeThrough)
  if (type === DirentType.DirectoryExpanded) {
    return [
      {
        type: VirtualDomElements.Div,
        className: 'TreeItem',
        role: AriaRoles.TreeItem,
        ariaExpanded: true,
        ariaPosInSet: posInSet,
        ariaSetSize: setSize,
        childCount: 3,
      },
      {
        type: VirtualDomElements.Div,
        className: 'Chevron',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: `MaskIcon MaskIcon${icon}`,
        role: AriaRoles.None,
        childCount: 0,
      },
      {
        type: VirtualDomElements.Div,
        className: labelClassName,
        childCount: 1,
      },
      text(label),
      {
        type: VirtualDomElements.Div,
        className: 'SourceControlBadge',
        childCount: 1,
      },
      text(badgeCount),
    ]
  }
  /**
   * @type {any[]}
   */
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: 'TreeItem',
      role: AriaRoles.TreeItem,
      ariaPosInSet: posInSet,
      ariaSetSize: setSize,
      title: file,
      childCount: 3,
    },
    ...(icon === 'ChevronRight'
      ? [
          {
            type: VirtualDomElements.Div,
            className: 'Chevron',
            childCount: 1,
          },
          {
            type: VirtualDomElements.Div,
            className: `MaskIcon MaskIcon${icon}`,
            role: AriaRoles.None,
            childCount: 0,
          },
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
        className: 'LabelDetail',
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
          className: 'SourceControlButton',
          title: label,
          ariaLabel: label,
          childCount: 1,
        },
        {
          type: VirtualDomElements.Span,
          className: 'MaskIcon',
          maskImage: icon,
        },
      )
    }
  }
  dom.push({
    type: VirtualDomElements.Img,
    className: 'DecorationIcon',
    title: decorationIconTitle,
    src: decorationIcon,
    childCount: 0,
  })
  return dom
}

export const getSourceControlItemsVirtualDom = (items, buttonIndex, buttons) => {
  const result = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    result.push(...createItem(item, i, buttonIndex, buttons))
  }
  return result
}
