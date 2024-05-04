import * as GetVisibleCompletionItem from '../GetVisibleCompletionItem/GetVisibleCompletionItem.js'

export const getVisibleItems = (filteredItems, itemHeight, leadingWord, minLineY, maxLineY, focusedIndex) => {
  const visibleItems = []
  for (let i = minLineY; i < maxLineY; i++) {
    const filteredItem = filteredItems[i]
    visibleItems.push(GetVisibleCompletionItem.getVisibleIem(filteredItem, itemHeight, leadingWord, i, focusedIndex))
  }
  return visibleItems
}
