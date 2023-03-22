import * as Editor from '../Editor/Editor.js'
import * as Clamp from '../Clamp/Clamp.js'
import * as Assert from '../Assert/Assert.js'

export const setDeltaY = (editor, deltaY) => {
  return Editor.setDeltaY(editor, deltaY)
}

export const setDeltaYFixedValue = (editor, deltaY) => {
  return Editor.setDeltaYFixedValue(editor, deltaY)
}

export const setDelta = (editor, deltaMode, eventDeltaX, eventDeltaY) => {
  Assert.number(deltaMode)
  Assert.number(eventDeltaX)
  Assert.number(eventDeltaY)
  const { deltaX, deltaY } = editor
  if (eventDeltaX === 0) {
    return setDeltaY(editor, eventDeltaY)
  }
  const newDeltaX = Clamp.clamp(deltaX + eventDeltaX, 0, Infinity)
  return {
    ...setDeltaY(editor, eventDeltaY),
    deltaX: newDeltaX,
  }
}
