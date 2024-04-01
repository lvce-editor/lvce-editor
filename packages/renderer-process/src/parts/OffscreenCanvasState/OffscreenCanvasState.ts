export const state = {
  canvasObjects: Object.create(null),
}

export const get = (id) => {
  return state.canvasObjects[id]
}

export const set = (canvasId, canvas) => {
  state.canvasObjects[canvasId] = canvas
}
