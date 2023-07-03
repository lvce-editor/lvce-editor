import { div, i, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const labelWrapper = div(
  {
    className: 'QuickPickItemLabel',
  },
  1
)

const descirptionWrapper = div(
  {
    className: 'QuickPickItemDescription',
  },
  1
)

const getQuickPickItemVirtualDom = (visibleItem) => {
  const { posInSet, label, setSize, isActive, description, icon } = visibleItem
  const dom = []
  dom.push(
    div(
      {
        className: 'QuickPickItem',
        role: 'option',
        ariaPosInSet: posInSet,
        ariaSetSize: setSize,
      },
      2
    )
  )
  if (isActive) {
    dom[0].props.id = 'QuickPickItemActive'
  }
  if (icon) {
    dom[0].childCount++
    dom.push(
      i(
        {
          className: `FileIcon FileIcon${icon}`,
        },
        0
      )
    )
  }
  dom.push(labelWrapper, text(label), descirptionWrapper, text(description))
  return dom
}

export const getQuickPickItemsVirtualDom = (visibleItems) => {
  if (visibleItems.length === 0) {
    return [
      div(
        {
          className: 'QuickPickStatus',
        },
        1
      ),
      text('No Results'),
    ]
  }
  const dom = visibleItems.flatMap(getQuickPickItemVirtualDom)
  return dom
}
