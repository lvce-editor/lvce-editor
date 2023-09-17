import * as DirentType from '../DirentType/DirentType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'

const getLabelClassName = (decorationStrikeThrough) => {
  let className = 'Label'
  if (decorationStrikeThrough) {
    className += ' StrikeThrough'
  }
  return className
}

const createItem = (item) => {
  console.log({ item })
  const { type, posInSet, setSize, icon, file, label, badgeCount, title, decorationIcon, decorationIconTitle, decorationStrikeThrough, detail } = item
  const labelClassName = getLabelClassName(decorationStrikeThrough)
  if (item.type === DirentType.DirectoryExpanded) {
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
        className: 'MaskIcon',
        role: AriaRoles.None,
        maskImage: icon,
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
    {
      type: VirtualDomElements.Div,
      className: `FileIcon FileIcon${icon}`,
      childCount: 0,
    }
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
      text(detail)
    )
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

export const getSourceControlItemsVirtualDom = (items) => {
  return [...items.flatMap(createItem)]
}
