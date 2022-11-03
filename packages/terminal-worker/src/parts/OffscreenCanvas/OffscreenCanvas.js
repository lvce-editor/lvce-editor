import * as TerminalModel from '../TerminalModel/TerminalModel.js'

export const state = {
  canvasObjects: Object.create(null),
}

export const add = (canvasId, canvas) => {
  const context = canvas.getContext('2d', {
    alpha: false,
  })
  state.canvasObjects[canvasId] = { canvas, context }
  TerminalModel.create(canvasId)
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

const getCanvasObject = (canvasId) => {
  const { canvasObjects } = state
  const canvasObject = canvasObjects[canvasId]
  if (!canvasObject) {
    throw new Error(`canvas not found ${canvasId}`)
  }
  return canvasObject
}

export const getCanvas = (canvasId) => {
  const canvasObject = getCanvasObject(canvasId)
  return canvasObject.canvas
}

export const getContext = (canvasId) => {
  const canvasObject = getCanvasObject(canvasId)
  return canvasObject.context
}
