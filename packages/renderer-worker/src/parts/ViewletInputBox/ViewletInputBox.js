import * as Command from '../Command/Command.js'

export const name = 'Input'

export const create = ({ handleInput }) => {
  return {
    value: '',
    selection: new Uint16Array([0, 0]),
    handleInput,
  }
}

export const cursorLeft = (state) => {
  return state
}

export const cursorRight = (state) => {
  return state
}

export const cursorEnd = (state) => {
  return state
}

export const cursorHome = (state) => {
  return state
}

export const selectLeftByCharacter = (state) => {
  return state
}

export const selectLeftByWord = (state) => {
  return state
}

export const selectRightByCharacter = (state) => {
  return state
}

export const selectRightByWord = (state) => {
  return state
}

const getNewValue = (value, key) => {
  return value + key
}

const handleInput = async (state, newValue) => {
  await Command.execute(state.handleInput, newValue)
  return {
    ...state,
    value: newValue,
  }
}

export const handleKeyDown = async (state, key) => {
  console.log({ state })
  console.log('handle key down', key)
  const newValue = getNewValue(state.value, key)
  return handleInput(state, newValue)
}

export const deleteLeft = (state) => {
  const newValue = state.value.slice(0, -1)
  return handleInput(state, newValue)
}

export const deleteRight = (state) => {
  const newValue = state.value.slice(0, -1)
  return handleInput(state, newValue)
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  const changes = []
  return changes
}
