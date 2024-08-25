export const removeValues = (value: unknown, toRemove: readonly unknown[]): any => {
  if (!value) {
    return value
  }
  if (Array.isArray(value)) {
    const newItems: any[] = []
    for (const item of value) {
      if (!toRemove.includes(item)) {
        newItems.push(removeValues(item, toRemove))
      }
    }
    return newItems
  }
  if (typeof value === 'object') {
    const newObject = Object.create(null)
    for (const [key, property] of Object.entries(value)) {
      if (!toRemove.includes(property)) {
        newObject[key] = removeValues(property, toRemove)
      }
    }
    return newObject
  }
  return value
}
