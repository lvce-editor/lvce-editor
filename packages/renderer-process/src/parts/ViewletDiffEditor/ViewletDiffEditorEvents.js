import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as ViewletDiffEditorFunctions from './ViewletDiffEditorFunctions.js'

/**
 * @param {WheelEvent} event
 */
export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletDiffEditorFunctions.handleWheel(uid, deltaMode, deltaY)
}

export const handleScrollBarPointerDown = (event) => {
  // TODO
}
