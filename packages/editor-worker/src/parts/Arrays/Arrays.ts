// based on https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/common/arrays.ts#L625 (License MIT)

// @ts-ignore
export const insertInto = (array, start, newItems) => {
  const originalLength = array.length
  const newItemsLength = newItems.length
  array.length = originalLength + newItemsLength
  // Move the items after the start index, start from the end so that we don't overwrite any value.
  for (let i = originalLength - 1; i >= start; i--) {
    array[i + newItemsLength] = array[i]
  }

  for (let i = 0; i < newItemsLength; i++) {
    array[i + start] = newItems[i]
  }
}

/**
 * Alternative to the native Array.splice method, it
 * can only support limited number of items due to the maximum call stack size limit.
 */
// @ts-ignore
export const spliceLargeArray = (array, start, deleteCount, newItems) => {
  const result = array.splice(start, deleteCount)
  insertInto(array, start, newItems)
  return result
}

// @ts-ignore
export const push = (array, newItems) => {
  insertInto(array, array.length, newItems)
}

// @ts-ignore
export const last = (array) => {
  return array.at(-1)
}

// @ts-ignore
export const first = (array) => {
  return array[0]
}

// TODO use this function more often
// @ts-ignore
export const firstIndex = (array) => {
  return 0
}

// TODO use this function more often
// @ts-ignore
export const lastIndex = (array) => {
  return array.length - 1
}

// @ts-ignore
export const fromAsync = async (asyncIterable) => {
  const children: any[] = []
  for await (const value of asyncIterable) {
    children.push(value)
  }
  return children
}

// @ts-ignore
export const findObjectIndex = (array, key, value) => {
  for (const [i, element] of array.entries()) {
    if (element[key] === value) {
      return i
    }
  }
  return -1
}

// @ts-ignore
export const isLastIndex = (array, index) => {
  return index === array.length - 1
}

// @ts-ignore
export const toSpliced = (array, index, deleteCount, ...inserted) => {
  return [...array.slice(0, index), ...inserted, ...array.slice(index + deleteCount)]
}

// @ts-ignore
export const remove = (array, index, deleteCount) => {
  return toSpliced(array, index, deleteCount)
}

// @ts-ignore
export const toSorted = (array, compare) => {
  return [...array].sort(compare)
}

// @ts-ignore
export const removeElement = (array, element) => {
  const index = array.indexOf(element)
  if (index === -1) {
    return array
  }
  return [...array.slice(0, index), ...array.slice(index + 1)]
}
