import * as Assert from '../Assert/Assert.ts'
// @ts-ignore
import * as Clamp from '../Clamp/Clamp.ts'
// @ts-ignore
import * as Editor from '../Editor/Editor.ts'

// @ts-ignore
export const setDeltaY = (editor, deltaY) => {
  return Editor.setDeltaY(editor, deltaY)
}

// @ts-ignore
export const setDeltaYFixedValue = (editor, deltaY) => {
  return Editor.setDeltaYFixedValue(editor, deltaY)
}

// @ts-ignore
export const setDelta = (editor, deltaMode, eventDeltaX, eventDeltaY) => {
  Assert.number(deltaMode)
  Assert.number(eventDeltaX)
  Assert.number(eventDeltaY)
  // @ts-ignore
  const { deltaX, deltaY } = editor
  if (eventDeltaX === 0) {
    return setDeltaY(editor, eventDeltaY)
  }
  const newDeltaX = Clamp.clamp(deltaX + eventDeltaX, 0, Number.POSITIVE_INFINITY)
  return {
    ...setDeltaY(editor, eventDeltaY),
    deltaX: newDeltaX,
  }
}
