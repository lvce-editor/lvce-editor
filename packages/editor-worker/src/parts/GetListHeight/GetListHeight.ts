import * as Assert from '../Assert/Assert.ts'

export const getListHeight = (itemsLength: number, itemHeight: number, maxHeight: number) => {
  Assert.number(itemsLength)
  Assert.number(itemHeight)
  Assert.number(maxHeight)
  if (itemsLength === 0) {
    return itemHeight
  }
  const totalHeight = itemsLength * itemHeight
  return Math.min(totalHeight, maxHeight)
}
