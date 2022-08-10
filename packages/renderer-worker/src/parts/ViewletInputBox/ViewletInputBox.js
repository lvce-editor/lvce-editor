import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as IgnoredKeys from '../IgnoredKeys/IgnoredKeys.js'

export const name = 'Input'

export const create = ({ handleInput }) => {
  return {
    value: '',
    selectionStart: 0,
    selectionEnd: 0,
    handleInput,
  }
}

export const setCursor = (state, offset) => {
  return {
    ...state,
    selectionStart: offset,
    selectionEnd: offset,
  }
}

export const cursorLeft = (state) => {
  const { selectionStart, selectionEnd } = state
  if (selectionStart === selectionEnd) {
    if (selectionStart === 0) {
      return state
    }
    const newOffset = selectionStart - 1
    return setCursor(state, newOffset)
  }
  return setCursor(state, selectionStart)
}

export const cursorRight = (state) => {
  const { selectionStart, selectionEnd, value } = state
  if (selectionStart === selectionEnd) {
    if (selectionEnd >= value.length) {
      return state
    }
    const newOffset = selectionEnd + 1
    return setCursor(state, newOffset)
  }
  return setCursor(state, selectionEnd)
}

export const cursorEnd = (state) => {
  return setCursor(state, state.value.length)
}

export const cursorHome = (state) => {
  return setCursor(state, 0)
}

export const selectLeftByCharacter = (state) => {
  return state
}

export const selectLeftByWord = (state) => {
  return state
}

const setSelection = (state, selectionStart, selectionEnd) => {
  return {
    ...state,
    selectionStart,
    selectionEnd,
  }
}

export const selectRightByCharacter = (state) => {
  console.log('select char right')
  const { selectionEnd, value } = state
  if (selectionEnd >= value.length) {
    return state
  }
  return {
    ...state,
    selectionEnd: selectionEnd + 1,
  }
}

export const selectRightByWord = (state) => {
  return state
}

const getNewValueAndOffset = (value, selectionStart, selectionEnd, key) => {
  const before = value.slice(0, selectionStart)
  const after = value.slice(selectionEnd)
  const newValue = before + key + after
  const offset = selectionStart + key.length
  return {
    newValue,
    offset,
  }
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
  if (IgnoredKeys.isIgnoredKey(key)) {
    return state
  }
  const { selectionStart, selectionEnd, value } = state
  const { newValue, offset } = getNewValueAndOffset(
    value,
    selectionStart,
    selectionEnd,
    key
  )
  return handleInput(state, newValue, offset, offset)
}

export const deleteLeft = (state) => {
  const newValue = state.value.slice(0, -1)
  const cursorOffset = newValue.length
  return handleInput(state, newValue, cursorOffset, cursorOffset)
}

const getNewValueDeleteRight = (value, selectionStart, selectionEnd) => {
  if (selectionStart === selectionEnd) {
    return {
      value: value.slice(0, -1),
      selectionStart: value.length - 1,
      selectionEnd: value.length - 1,
    }
  }
  return {
    value: '',
    selectionStart: 0,
    selectionEnd: 0,
  }
}

export const deleteRight = (state) => {
  const { selectionStart, selectionEnd, value } = state
  const newState = getNewValueDeleteRight(value, selectionStart, selectionEnd)
  return handleInput(
    state,
    newState.newValue,
    newState.selectionStart,
    newState.selectionEnd
  )
}

export const handleDoubleClick = (state) => {
  return {
    ...state,
    selectionStart: 0,
    selectionEnd: state.value.length,
  }
}

export const handleSingleClick = (state, offset) => {
  return {
    ...state,
    selectionStart: offset,
    selectionEnd: offset,
  }
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
      /* id */ 'Input',
      /* method */ 'setSelection',
      /* selectionStart */ newState.selectionStart,
      /* selectionEnd */ newState.selectionEnd,
    ])
  }
  return changes
}
