import * as Event from '../Event/Event.js'
import * as ViewletEditorCompletionFunctions from './ViewletEditorCompletionFunctions.js'

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getIndex = ($Target) => {
  if ($Target.classList.contains('EditorCompletionItem')) {
    return getNodeIndex($Target)
  }
  return -1
}

export const handleMousedown = (event) => {
  Event.preventDefault(event)
  const { clientX, clientY } = event
  ViewletEditorCompletionFunctions.handleClickAt(clientX, clientY)
}

export const handleWheel = (event) => {
  const { deltaY, deltaMode } = event
  ViewletEditorCompletionFunctions.handleWheel(deltaY, deltaMode)
}
