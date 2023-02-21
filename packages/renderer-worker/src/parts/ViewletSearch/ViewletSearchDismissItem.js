import * as Arrays from '../Arrays/Arrays.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as ViewletSearchStatusMessage from './ViewletSearchStatusMessage.js'

const getSetSize = (items, index) => {
  let setSize = 0
  for (let i = index + 1; i < items.length; i++) {
    if (items[i].type === TextSearchResultType.File) {
      break
    }
    setSize++
  }
  return setSize
}

const getRemoveIndicesFile = (items, item, index, matchCount, fileCount) => {
  const setSize = getSetSize(items, index)
  return {
    startIndex: index,
    removeCount: setSize + 1,
    newFocusedIndex: index + setSize + 1 < items.length ? index : index - 1,
    newFileCount: fileCount - 1,
    newMatchCount: matchCount - setSize,
  }
}

const getRemoveIndicesMatch = (items, index, matchCount, fileCount) => {
  for (let i = index; i >= 0; i--) {
    if (items[i].type === TextSearchResultType.File) {
      const setSize = getSetSize(items, i)
      if (setSize === 1) {
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
        newFocusedIndex: index,
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
      return getRemoveIndicesFile(items, item, index, matchCount, fileCount)
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

const getNewMinMax = (newItemsLength, minLineY, maxLineY, deltaY, itemHeight) => {
  if (maxLineY > newItemsLength) {
    const diff = maxLineY - minLineY
    const newMinLineY = Math.max(newItemsLength - diff, 0)
    const newDeltaY = newMinLineY * itemHeight
    return {
      newDeltaY,
      newMinLineY,
      newMaxLineY: newItemsLength,
    }
  }
  return {
    newDeltaY: deltaY,
    newMinLineY: minLineY,
    newMaxLineY: maxLineY,
  }
}
export const dismissItem = (state) => {
  const { items, listFocusedIndex, fileCount, matchCount, minLineY, maxLineY, deltaY, itemHeight } = state
  if (listFocusedIndex === -1) {
    return state
  }
  const { newItems, newFocusedIndex, newMatchCount, newFileCount } = removeItemFromItems(items, listFocusedIndex, matchCount, fileCount)
  const message = ViewletSearchStatusMessage.getStatusMessage(newMatchCount, newFileCount)
  const { newMinLineY, newMaxLineY, newDeltaY } = getNewMinMax(newItems.length, minLineY, maxLineY, deltaY, itemHeight)
  return {
    ...state,
    items: newItems,
    listFocusedIndex: newFocusedIndex,
    message,
    matchCount: newMatchCount,
    fileCount: newFileCount,
    minLineY: newMinLineY,
    maxLineY: newMaxLineY,
    deltaY: newDeltaY,
  }
}
