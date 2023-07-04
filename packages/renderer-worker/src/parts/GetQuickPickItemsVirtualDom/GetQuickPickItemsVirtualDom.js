import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const labelWrapper = {
  type: VirtualDomElements.Div,
  className: 'QuickPickItemLabel',
  childCount: 1,
}

const descriptionWrapper = {
  type: VirtualDomElements.Div,
  className: 'QuickPickItemDescription',
  childCount: 1,
}

const getQuickPickItemVirtualDom = (visibleItem) => {
  const { posInSet, label, setSize, isActive, description, icon } = visibleItem
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: 'QuickPickItem',
    role: 'option',
    ariaPosInSet: posInSet,
    ariaSetSize: setSize,
    childCount: 2,
  })
  if (isActive) {
    // @ts-ignore
    dom[0].id = 'QuickPickItemActive'
  }
  if (icon) {
    dom[0].childCount++
    dom.push({
      type: VirtualDomElements.I,
      className: `FileIcon FileIcon${icon}`,
      childCount: 0,
    })
  }
  dom.push(labelWrapper, text(label), descriptionWrapper, text(description))
  return dom
}

export const getQuickPickItemsVirtualDom = (visibleItems) => {
  if (visibleItems.length === 0) {
    return [
      {
        type: VirtualDomElements.Div,
        className: 'QuickPickStatus',
        childCount: 1,
      },
      text('No Results'),
    ]
  }
  const dom = visibleItems.flatMap(getQuickPickItemVirtualDom)
  return dom
}
