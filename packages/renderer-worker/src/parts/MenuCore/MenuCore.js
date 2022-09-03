import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const getIndexToFocusNextStartingAt = (items, startIndex) => {
  for (let i = startIndex; i < startIndex + items.length; i++) {
    const index = i % items.length
    const item = items[index]
    if (canBeFocused(item)) {
      return index
    }
    console.log({ index, item })
  }
  console.log({ startIndex, items })
  return -1
}

export const getIndexToFocusFirst = (menu) => {
  return getIndexToFocusNextStartingAt(menu.items, 0)
}

// TODO this code seems a bit too complicated, maybe it can be simplified
const getIndexToFocusPreviousStartingAt = (items, startIndex) => {
  for (let i = startIndex; i > startIndex - items.length; i--) {
    const index = (i + items.length) % items.length
    const item = items[index]
    if (canBeFocused(item)) {
      return index
    }
  }
  return -1
}

export const getIndexToFocusLast = (menu) => {
  return getIndexToFocusPreviousStartingAt(menu.items, menu.items.length - 1)
}

export const getIndexToFocusPrevious = (menu) => {
  const startIndex =
    menu.focusedIndex === -1 ? menu.items.length - 1 : menu.focusedIndex - 1
  return getIndexToFocusPreviousStartingAt(menu.items, startIndex)
}

const canBeFocused = (item) => {
  return (
    item.flags !== MenuItemFlags.Separator &&
    item.flags !== MenuItemFlags.Disabled
  )
}

export const getIndexToFocusNext = (menu) => {
  const startIndex = menu.focusedIndex + 1
  return getIndexToFocusNextStartingAt(menu.items, startIndex)
}
