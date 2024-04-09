import * as GetActivityBarItemsVirtualDom from '../GetActivityBarItemsVirtualDom/GetActivityBarItemsVirtualDom.js'

export const getActivityBarVirtualDom = (visibleItems) => {
  return [...GetActivityBarItemsVirtualDom.getVirtualDom(visibleItems)]
}
