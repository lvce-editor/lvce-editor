import * as Assert from '../Assert/Assert.js'

export const getListHeight = (itemsLength, itemHeight, maxHeight) => {
  Assert.number(itemsLength)
  Assert.number(itemHeight)
  Assert.number(maxHeight)
  if (itemsLength === 0) {
    return itemHeight
  }
  const totalHeight = itemsLength * itemHeight
  return Math.min(totalHeight, maxHeight)
}
