import * as Assert from '../Assert/Assert.ts'
import * as Icon from '../Icon/Icon.js'
import * as TitleBarMenuBarStrings from '../TitleBarMenuBarStrings/TitleBarMenuBarStrings.js'

export const getVisibleTitleBarEntries = (entries, width, focusedIndex, isMenuOpen) => {
  Assert.array(entries)
  Assert.number(width)
  let total = 0
  const visible = []
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    total += entry.width
    if (total >= width) {
      break
    }
    const isOpen = i === focusedIndex && isMenuOpen
    const isFocused = i === focusedIndex
    visible.push({ ...entry, isOpen, isFocused })
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
