import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetQuickPickItemVirtualDom from '../GetQuickPickItemVirtualDom/GetQuickPickItemVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getQuickPickItemsVirtualDom = (visibleItems) => {
  if (visibleItems.length === 0) {
    return [
      {
        type: VirtualDomElements.Div,
        className: 'QuickPickItem QuickPickItemActive QuickPickStatus',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: ClassNames.Label,
        childCount: 1,
      },
      text('No Results'),
    ]
  }
  const dom = visibleItems.flatMap(GetQuickPickItemVirtualDom.getQuickPickItemVirtualDom)
  return dom
}
