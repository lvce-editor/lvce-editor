import * as GetTabDom from '../GetTabDom/GetTabDom.js'

export const getTabsDom = (visibleTabs) => {
  const tabsDom = visibleTabs.flatMap(GetTabDom.getTabDom)
  return tabsDom
}
