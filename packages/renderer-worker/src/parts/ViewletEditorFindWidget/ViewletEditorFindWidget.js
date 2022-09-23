import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const name = 'EditorFindWidget'

export const create = () => {
  return {
    value: '',
  }
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
  const editor = ViewletStates.getState('EditorText')
  if (!editor) {
    return state
  }
  const { selections, lines } = editor
  const startRowIndex = selections[0]
  const startColumnIndex = selections[1]
  const endRowIndex = selections[2]
  const endColumnIndex = selections[3]
  const line = lines[startRowIndex]
  const value = line.slice(startColumnIndex, endColumnIndex)
  return {
    ...state,
    value,
  }
}

export const handleInput = (state, value) => {
  // TODO get focused editor
  // highlight locations that match value
  const editor = ViewletStates.getState('EditorText')
  const lines = editor.lines
  console.log({ lines })
  return {
    ...state,
    value,
  }
}

export const hasFunctionalRender = true

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'EditorFindWidget',
      /* method */ 'setValue',
      /* value */ newState.value,
    ]
  },
}

export const render = [renderValue]
