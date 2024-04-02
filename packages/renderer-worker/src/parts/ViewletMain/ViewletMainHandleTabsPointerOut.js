import * as Assert from '../Assert/Assert.ts'
import * as TabFlags from '../TabFlags/TabFlags.js'
import * as GetTabIndex from '../GetTabIndex/GetTabIndex.js'

export const handleTabsPointerOut = (state, eventX, eventY) => {
  Assert.number(eventX)
  Assert.number(eventY)
  const { groups, activeGroupIndex } = state
  const group = groups[activeGroupIndex]
  const { editors, x, y } = group
  const newIndex = GetTabIndex.getTabIndex(editors, x, eventX)
  return {
    ...state,
  }
}
