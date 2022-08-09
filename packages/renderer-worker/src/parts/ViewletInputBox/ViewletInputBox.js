import * as Command from '../Command/Command.js'
import * as Assert from '../Assert/Assert.js'

export const name = 'Input'

export const create = ({ handleInput }) => {
  return {
    value: '',
    selectionStart: 0,
    selectionEnd: 0,
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

const handleInput = async (state, newValue, selectionStart, selectionEnd) => {
  Assert.object(state)
  Assert.string(newValue)
  Assert.number(selectionStart)
  Assert.number(selectionEnd)
  await Command.execute(state.handleInput, newValue)
  return {
    ...state,
    value: newValue,
    selectionStart,
    selectionEnd,
  }
}

export const handleKeyDown = async (state, key) => {
  const newValue = getNewValue(state.value, key)
  const cursorOffset = newValue.length
  return handleInput(state, newValue, cursorOffset, cursorOffset)
}

export const deleteLeft = (state) => {
  const newValue = state.value.slice(0, -1)
  const cursorOffset = newValue.length
  return handleInput(state, newValue, cursorOffset, cursorOffset)
}

export const deleteRight = (state) => {
  const newValue = state.value.slice(0, -1)
  const cursorOffset = newValue.length
  return handleInput(state, newValue, cursorOffset, cursorOffset)
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  const changes = []
  if (oldState.value !== newState.value) {
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Input',
      /* method */ 'setValue',
      /* value */ newState.value,
    ])
  }
  if (
    oldState.selectionStart !== newState.selectionStart ||
    oldState.selectionEnd !== newState.selectionEnd
  ) {
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'setSelectiom',
      /* selectionStart */ newState.selectionStart,
      /* selectionEnd */ newState.selectionEnd,
    ])
  }
  return changes
}
