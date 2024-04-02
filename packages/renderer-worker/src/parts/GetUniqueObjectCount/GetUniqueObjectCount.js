import * as Assert from '../Assert/Assert.ts'

export const getUniqueObjectCount = (objects, key) => {
  Assert.array(objects)
  Assert.string(key)
  const seen = []
  for (const object of objects) {
    const value = object[key]
    if (!seen.includes(value)) {
      seen.push(value)
    }
  }
  return seen.length
}
