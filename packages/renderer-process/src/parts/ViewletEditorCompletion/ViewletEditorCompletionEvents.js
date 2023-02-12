import * as WheelEventType from '../WheelEventType/WheelEventType.js'
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
  event.preventDefault()
  const $Target = event.target
  const index = getIndex($Target)
  if (index === -1) {
    return
  }
  ViewletEditorCompletionFunctions.selectIndex(index)
}

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  switch (deltaMode) {
    case WheelEventType.DomDeltaLine:
    case WheelEventType.DomDeltaPixel:
      ViewletEditorCompletionFunctions.handleWheel(deltaY)
      break
    default:
      break
  }
}
