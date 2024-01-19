// TODO optimize this function to return the minimum number
// of visible items needed, e.g. when not scrolled 5 items with
// 20px fill 100px but when scrolled 6 items are needed
export const getNumberOfVisibleItems = (listHeight, itemHeight) => {
  return Math.ceil(listHeight / itemHeight) + 1
}
