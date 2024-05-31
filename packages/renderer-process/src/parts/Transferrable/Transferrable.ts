const state = {
  objects: Object.create(null),
}

export const transfer = (objectId, transferable) => {
  state.objects[objectId] = transferable
}

export const acquire = (objectId) => {
  const value = state.objects[objectId]
  delete state.objects[objectId]
  return value
}
