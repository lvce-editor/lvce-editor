import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const name = 'EditorFind'

export const create = () => {
  return {}
}

export const getPosition = () => {
  const editor = ViewletStates.getState('EditorText')
  console.log({ editor })
  return {
    top: 0,
    left: 0,
    width: 80,
    height: 80,
  }
}

export const loadContent = (state) => {
  return state
}

export const handleInput = (state, value) => {
  // TODO get focused editor
  // highlight locations that match value
  return state
}

export const hasFunctionalRender = true

export const render = []
