import * as Event from '../Event/Event.js'
import * as ViewletEditorCompletionFunctions from './ViewletEditorCompletionFunctions.js'

export const handleMousedown = (event) => {
  Event.preventDefault(event)
  const { clientX, clientY } = event
  ViewletEditorCompletionFunctions.handleClickAt(clientX, clientY)
}

export const handleWheel = (event) => {
  const { deltaY, deltaMode } = event
  ViewletEditorCompletionFunctions.handleWheel(deltaY, deltaMode)
}
