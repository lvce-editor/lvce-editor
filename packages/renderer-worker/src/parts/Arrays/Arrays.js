// based on https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/common/arrays.ts#L625 (License MIT)

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
export const splice = (array, start, deleteCount, newItems) => {
  const result = array.splice(start, deleteCount)
  insertInto(array, start, newItems)
  return result
}

export const last = (array) => {
  return array[array.length - 1]
}

export const first = (array) => {
  return array[0]
}

// TODO use this function more often
export const firstIndex = (array) => {
  return 0
}

// TODO use this function more often
export const lastIndex = (array) => {
  return array.length - 1
}

export const fromAsync = async (asyncIterable) => {
  const children = []
  for await (const value of asyncIterable) {
    children.push(value)
  }
  return children
}

export const findObjectIndex = (array, key, value) => {
  for (let i = 0; i < array.length; i++) {
    const element = array[i]
    if (element[key] === value) {
      return i
    }
  }
  return -1
}

export const isLastIndex = (array, index) => {
  return index === array.length - 1
}
