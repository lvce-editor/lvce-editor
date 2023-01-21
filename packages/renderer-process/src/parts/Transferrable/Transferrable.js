export const state = {
  objects: Object.create(null),
}

export const transfer = (objectId, transferable) => {
  state.objects[objectId] = transferable
}

export const get = (objectId) => {
  const object = state.objects[objectId]
  if (!object) {
    throw new Error(`object not found ${objectId}`)
  }
  return object
}
