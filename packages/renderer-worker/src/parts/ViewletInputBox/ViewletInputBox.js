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

export const handleKeyDown = async (state, key) => {
  console.log({ state })
  console.log('handle key down', key)
  const newValue = getNewValue(state.value, key)
  await Command.execute(state.handleInput, newValue)
  return {
    ...state,
    value: newValue,
  }
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  const changes = []
  return changes
}
