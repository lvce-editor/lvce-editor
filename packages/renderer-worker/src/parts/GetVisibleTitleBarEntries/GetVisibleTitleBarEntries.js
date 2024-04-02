import * as Assert from '../Assert/Assert.ts'
import * as Icon from '../Icon/Icon.js'
import * as TitleBarMenuBarStrings from '../TitleBarMenuBarStrings/TitleBarMenuBarStrings.js'

export const getVisibleTitleBarEntries = (entries, width) => {
  Assert.array(entries)
  Assert.number(width)
  let total = 0
  const visible = []
  for (const entry of entries) {
    total += entry.width
    if (total >= width) {
      break
    }
    visible.push(entry)
  }
  const hasOverflow = visible.length < entries.length
  if (hasOverflow) {
    const padding = 8
    const moreIconWidth = 22
    const totalPadding = padding * 2
    const hasStillOverflow = total + moreIconWidth + totalPadding > width
    if (hasStillOverflow) {
      visible.pop()
    }
    visible.push({
      ariaLabel: TitleBarMenuBarStrings.more(),
      icon: Icon.Ellipsis,
      label: '',
      width: moreIconWidth + totalPadding,
    })
  }
  return visible
}
