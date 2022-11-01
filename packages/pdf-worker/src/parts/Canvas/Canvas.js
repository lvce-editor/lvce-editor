export const state = {
  canvasObjects: Object.create(null),
}

export const add = (id, canvas) => {
  state.canvasObjects[id] = canvas
}
