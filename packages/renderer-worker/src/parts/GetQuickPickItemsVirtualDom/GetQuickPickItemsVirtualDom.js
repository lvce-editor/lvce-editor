import { div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const createItemDom = (item) => {
  const { label, description, icon } = item
  const itemDom = div(
    {
      className: 'QuickPickItem',
      role: 'option',
    },
    0
  )
  const dom = [itemDom]
  if (icon) {
    itemDom.childCount++
    dom.push(
      div(
        {
          className: `FileIcon FileIcon${icon}`,
        },
        0
      )
    )
  }
  if (label) {
    itemDom.childCount++
    dom.push(
      div(
        {
          className: 'QuickPickLabel',
        },
        1
      ),
      text(label)
    )
  }
  if (description) {
    itemDom.childCount++
    dom.push(
      div(
        {
          className: 'QuickPickItemDescription',
        },
        1
      ),
      text(description)
    )
  }
  return dom
}

export const getQuickPickItemsVirtualDom = (items) => {
  const dom = items.flatMap(createItemDom)
  return dom
}
