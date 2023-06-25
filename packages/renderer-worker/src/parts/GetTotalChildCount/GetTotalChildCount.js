/**
 *
 * @param {any[]} array
 * @param {number} startIndex
 * @returns
 */
export const getTotalChildCount = (array, startIndex) => {
  const startItem = array[startIndex]
  let index = startIndex
  let end = startIndex + startItem.childCount
  while (++index <= end) {
    const item = array[index]
    end += item.childCount
  }
  return end - startIndex
}
