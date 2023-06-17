import { div, img, span, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getLabelClassName = (decorationStrikeThrough) => {
  let className = 'Label'
  if (decorationStrikeThrough) {
    className += ' StrikeThrough'
  }
  return className
}

const createItem = (item) => {
  const { type, posInSet, setSize, icon, file, label, badgeCount, title, decorationIcon, decorationIconTitle, decorationStrikeThrough, detail } = item
  const labelClassName = getLabelClassName(decorationStrikeThrough)
  if (item.type === 'directory-expanded') {
    return [
      div(
        {
          className: 'TreeItem',
          role: 'treeitem',
          ariaExpanded: true,
          ariaPosInSet: posInSet,
          ariaSetSize: setSize,
        },
        3
      ),
      div(
        {
          className: 'Chevron',
        },
        1
      ),
      div(
        {
          className: 'MaskIcon',
          role: 'none',
          maskImage: icon,
        },
        0
      ),
      div(
        {
          className: labelClassName,
        },
        1
      ),
      text(label),
      div(
        {
          className: 'SourceControlBadge',
        },
        1
      ),
      text(badgeCount),
    ]
  }
  const dom = []
  dom.push(
    div(
      {
        className: 'TreeItem',
        role: 'treeitem',
        ariaPosInSet: posInSet,
        ariaSetSize: setSize,
        title: file,
      },
      3
    ),
    div(
      {
        className: `FileIcon FileIcon${icon}`,
      },
      0
    )
  )
  const labelDom = div(
    {
      className: labelClassName,
    },
    1
  )
  dom.push(labelDom, text(label))
  if (detail) {
    labelDom.childCount++
    dom.push(
      span(
        {
          className: 'LabelDetail',
        },
        1
      ),
      text(detail)
    )
  }
  dom.push(
    img({
      className: 'DecorationIcon',
      title: decorationIconTitle,
      src: decorationIcon,
    })
  )
  return dom
}

export const getSourceControlItemsVirtualDom = (items) => {
  return [...items.flatMap(createItem)]
}
