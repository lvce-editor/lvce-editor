const objects = Object.create(null)

export const transfer = (objectId, transferable) => {
  objects[objectId] = transferable
}

export const acquire = (objectId) => {
  const value = objects[objectId]
  delete objects[objectId]
  return value
}
