export const state = {
  canvasObjects: Object.create(null),
}

export const add = (canvasId, canvas) => {
  state.canvasObjects[canvasId] = canvas
}

export const remove = (canvasId) => {
  delete state.canvasObjects[canvasId]
}

export const keys = () => {
  return Object.keys(state.canvasObjects)
}

export const values = () => {
  return Object.values(state.canvasObjects)
}

export const all = () => {
  return state.canvasObjects
}

export const reset = () => {
  state.canvasObjects = Object.create(null)
}

export const get = (canvasId) => {
  return state.canvasObjects[canvasId]
}
