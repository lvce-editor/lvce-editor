import * as Assert from '../Assert/Assert.ts'

export const getTabIndex = (tabs, x, eventX) => {
  Assert.array(tabs)
  Assert.number(x)
  Assert.number(eventX)
  const relativeX = eventX - x
  let total = 0
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i]
    total += tab.tabWidth
    if (total >= relativeX) {
      return i
    }
  }
  return -1
}
