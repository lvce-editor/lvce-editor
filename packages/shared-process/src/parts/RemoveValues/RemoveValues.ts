export const removeValues = (value, toRemove) => {
  if (!value) {
    return value
  }
  if (Array.isArray(value)) {
    const newItems = []
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
