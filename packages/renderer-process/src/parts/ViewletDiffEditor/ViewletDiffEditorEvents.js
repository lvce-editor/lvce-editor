import * as WheelEventType from '../WheelEventType/WheelEventType.js'
import * as ViewletDiffEditorFunctions from './ViewletDiffEditorFunctions.js'

/**
 * @param {WheelEvent} event
 */
export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  // event.preventDefault()
  // const state = EditorHelper.getStateFromEvent(event)
  // TODO send editor id
  switch (deltaMode) {
    case WheelEventType.DomDeltaLine:
      ViewletDiffEditorFunctions.handleWheel(deltaY)
      break
    default:
      break
  }
}

export const handleScrollBarPointerDown = (event) => {
  // TODO
}
