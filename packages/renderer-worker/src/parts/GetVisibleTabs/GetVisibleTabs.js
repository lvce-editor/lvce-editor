import * as GetTotalTabWidth from '../GetTotalTabWidth/GetTotalTabWidth.js'

const getFixedWidth = (width, tabsLength, hasOverflow) => {
  if (!hasOverflow) {
    return 0
  }
  return Math.max(width / tabsLength, 80)
}

export const getVisibleTabs = (tabs, width, activeIndex, deltaX) => {
  const totalTabWidth = GetTotalTabWidth.getTotalTabWidth(tabs)
  const hasOverflow = totalTabWidth > width
  const fixedWidth = getFixedWidth(width, tabs.length, hasOverflow)
  const visibleTabs = []
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i]
    const isActive = i === activeIndex
    visibleTabs.push({
      ...tab,
      isActive,
      fixedWidth,
    })
  }
  return visibleTabs
}
