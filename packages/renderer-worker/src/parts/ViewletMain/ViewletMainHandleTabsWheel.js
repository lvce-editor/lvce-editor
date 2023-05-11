import * as Assert from '../Assert/Assert.js'
import * as Clamp from '../Clamp/Clamp.js'

const getTotalTabWidth = (tabs) => {
  let total = 0
  for (const tab of tabs) {
    total += tab.tabWidth
  }
  return total
}

const getNewTabsDeltaX = (width, tabs, tabsDeltaX, deltaX) => {
  const totalTabWidth = getTotalTabWidth(tabs)
  const hasOverflow = totalTabWidth > width
  if (!hasOverflow) {
    return 0
  }
  const averageWidth = width / tabs.length
  const hasSecondaryOverflow = averageWidth < 80
  if (!hasSecondaryOverflow) {
    return 0
  }
  const fixedWidth = 80
  const totalWidth = tabs.length * fixedWidth
  const maxDeltaX = totalWidth - width
  const newDeltaX = Clamp.clamp(tabsDeltaX + deltaX, 0, maxDeltaX)
  return newDeltaX
}

export const handleTabsWheel = (state, deltaX, deltaY) => {
  Assert.number(deltaX)
  Assert.number(deltaY)
  const { groups, activeGroupIndex, width } = state
  const group = groups[activeGroupIndex]
  const { tabsDeltaX, editors } = group
  const newDeltaX = getNewTabsDeltaX(width, editors, tabsDeltaX, deltaY)
  if (newDeltaX === tabsDeltaX) {
    return state
  }
  const newGroup = {
    ...group,
    tabsDeltaX: newDeltaX,
  }
  const newGroups = [...groups.slice(0, activeGroupIndex), newGroup, ...groups.slice(activeGroupIndex + 1)]
  return {
    ...state,
    groups: newGroups,
  }
}
