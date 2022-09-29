import * as InputEventType from '../InputEventType/InputEventType.js'

const getNewValueInsertText = (value, selectionStart, selectionEnd, data) => {
  if (selectionStart === value.length) {
    const newValue = value + data
    return {
      newValue,
      cursorOffset: newValue.length,
    }
  }
  const before = value.slice(0, selectionStart)
  const after = value.slice(selectionEnd)
  const newValue = before + data + after
  return {
    newValue,
    cursorOffset: selectionStart + data.length,
  }
}

const getNewValueDeleteContentBackward = (
  value,
  selectionStart,
  selectionEnd,
  data
) => {
  const after = value.slice(selectionEnd)
  if (selectionStart === selectionEnd) {
    const before = value.slice(0, selectionStart - 1)
    const newValue = before + after
    return {
      newValue,
      cursorOffset: before.length,
    }
  }
  const before = value.slice(0, selectionStart)
  const newValue = before + after
  return {
    newValue,
    cursorOffset: selectionStart,
  }
}

const RE_ALPHA_NUMERIC = /[a-z\d]/i

const isAlphaNumeric = (character) => {
  return RE_ALPHA_NUMERIC.test(character)
}

const getNewValueDeleteWordBackward = (
  value,
  selectionStart,
  selectionEnd,
  data
) => {
  const after = value.slice(selectionEnd)
  if (selectionStart === selectionEnd) {
    let startIndex = Math.max(selectionStart - 1, 0)
    while (startIndex > 0 && isAlphaNumeric(value[startIndex])) {
      startIndex--
    }
    const before = value.slice(0, startIndex)
    const newValue = before + after
    return {
      newValue,
      cursorOffset: before.length,
    }
  }
  const before = value.slice(0, selectionStart)
  const newValue = before + after
  return {
    newValue,
    cursorOffset: selectionStart,
  }
}

const getNewValueDeleteContentForward = (
  value,
  selectionStart,
  selectionEnd,
  data
) => {
  const before = value.slice(0, selectionStart)
  if (selectionStart === selectionEnd) {
    const after = value.slice(selectionEnd + 1)
    const newValue = before + after
    return {
      newValue,
      cursorOffset: selectionStart,
    }
  }
  const after = value.slice(selectionEnd)
  const newValue = before + after
  return {
    newValue,
    cursorOffset: selectionStart,
  }
}

const getNewValueDeleteWordForward = (
  value,
  selectionStart,
  selectionEnd,
  data
) => {
  const before = value.slice(0, selectionStart)
  if (selectionStart === selectionEnd) {
    let startIndex = Math.min(selectionStart + 1, value.length - 1)
    while (startIndex < value.length && isAlphaNumeric(value[startIndex])) {
      startIndex++
    }
    const after = value.slice(startIndex)
    const newValue = before + after
    return {
      newValue,
      cursorOffset: before.length,
    }
  }
  const after = value.slice(selectionEnd)
  const newValue = before + after
  return {
    newValue,
    cursorOffset: selectionStart,
  }
}

const getNewValueInsertCompositionText = (
  value,
  selectionStart,
  selectionEnd,
  data
) => {
  return getNewValueInsertText(value, selectionStart, selectionEnd, data)
}

const getNewValueInsertLineBreak = (
  value,
  selectionStart,
  selectionEnd,
  data
) => {
  return {
    newValue: value,
    cursorOffset: selectionEnd,
  }
}

const getFn = (inputType) => {
  switch (inputType) {
    case InputEventType.InsertText:
      return getNewValueInsertText
    case InputEventType.DeleteContentBackward:
      return getNewValueDeleteContentBackward
    case InputEventType.DeleteContentForward:
      return getNewValueDeleteContentForward
    case InputEventType.DeleteWordForward:
      return getNewValueDeleteWordForward
    case InputEventType.DeleteWordBackward:
      return getNewValueDeleteWordBackward
    case InputEventType.InsertLineBreak:
      return getNewValueInsertLineBreak
    case InputEventType.InsertCompositionText:
      return getNewValueInsertCompositionText
    default:
      throw new Error(`unsupported input type ${inputType}`)
  }
}

export const getNewValue = (
  value,
  inputType,
  data,
  selectionStart,
  selectionEnd
) => {
  const fn = getFn(inputType)
  return fn(value, selectionStart, selectionEnd, data)
}
