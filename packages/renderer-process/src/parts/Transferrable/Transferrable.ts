const state = {
  objects: Object.create(null),
}

export const transfer = (objectId, transferable) => {
  state.objects[objectId] = transferable
}
