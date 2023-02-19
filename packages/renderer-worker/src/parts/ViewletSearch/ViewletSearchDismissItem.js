import * as Arrays from '../Arrays/Arrays.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as ViewletSearchStatusMessage from './ViewletSearchStatusMessage.js'

const getRemoveIndicesFile = (item, index, fileCount, matchCount) => {
  return {
    startIndex: index,
    removeCount: item.setSize + 1,
    newFocusedIndex: index - 1,
    newFileCount: fileCount - 1,
    newMatchCount: matchCount - item.setSize,
  }
}

const getRemoveIndicesMatch = (items, index, matchCount, fileCount) => {
  for (let i = index; i >= 0; i--) {
    if (items[i].type === TextSearchResultType.File) {
      if (items[i].setSize === 1) {
        return {
          startIndex: i,
          removeCount: 2,
          newFocusedIndex: i - 1,
          newFileCount: fileCount - 1,
          newMatchCount: matchCount - 1,
        }
      }
      return {
        startIndex: index,
        removeCount: 1,
        newFocusedIndex: i - 1,
        newFileCount: fileCount,
        newMatchCount: matchCount - 1,
      }
    }
  }
  throw new Error('could not compute indices to remove')
}

const getRemoveIndices = (items, index, matchCount, fileCount) => {
  const item = items[index]
  switch (item.type) {
    case TextSearchResultType.File:
      return getRemoveIndicesFile(item, index, matchCount, fileCount)
    case TextSearchResultType.Match:
      return getRemoveIndicesMatch(items, index, matchCount, fileCount)
    default:
      throw new Error('unknown search result type')
  }
}

const removeItemFromItems = (items, index, matchCount, fileCount) => {
  const { startIndex, removeCount, newFocusedIndex, newFileCount, newMatchCount } = getRemoveIndices(items, index, matchCount, fileCount)
  const newItems = Arrays.remove(items, startIndex, removeCount)
  return { newItems, newFocusedIndex, newFileCount, newMatchCount }
}

export const dismissItem = (state) => {
  const { items, listFocusedIndex, fileCount, matchCount } = state
  if (listFocusedIndex === -1) {
    return state
  }
  const { newItems, newFocusedIndex, newMatchCount, newFileCount } = removeItemFromItems(items, listFocusedIndex, matchCount, fileCount)
  const message = ViewletSearchStatusMessage.getStatusMessage(newMatchCount, newFileCount)
  return {
    ...state,
    items: newItems,
    listFocusedIndex: newFocusedIndex,
    message,
    matchCount: newMatchCount,
    fileCount: newFileCount,
  }
}
