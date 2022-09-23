import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const name = 'EditorFind'

export const create = () => {
  return {}
}

export const getPosition = () => {
  const editor = ViewletStates.getState('EditorText')
  if (!editor) {
    return {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    }
  }
  console.log(editor)
  const left = editor.left + editor.width - 100
  const top = editor.top + 10
  const width = 80
  const height = 30
  return {
    top,
    left,
    width,
    height,
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
