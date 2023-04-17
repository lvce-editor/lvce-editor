import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Event from '../Event/Event.js'
import * as ViewletEditorCompletionFunctions from './ViewletEditorCompletionFunctions.js'

export const handleMousedown = (event) => {
  Event.preventDefault(event)
  const { clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorCompletionFunctions.handleClickAt(uid, clientX, clientY)
}

export const handleWheel = (event) => {
  const { deltaY, deltaMode } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorCompletionFunctions.handleWheel(uid, deltaMode, deltaY)
}

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorCompletionFunctions.handleScrollBarThumbPointerMove(uid, clientY)
}

const handlePointerCaptureLost = (event) => {
  const { target } = event
  target.removeEventListener(DomEventType.PointerMove, handleScrollBarThumbPointerMove)
}

export const handleScrollBarPointerDown = (event) => {
  Event.preventDefault(event)
  const { target, pointerId, clientY } = event
  target.setPointerCapture(pointerId)
  target.addEventListener(DomEventType.PointerMove, handleScrollBarThumbPointerMove, DomEventOptions.Active)
  target.addEventListener(DomEventType.LostPointerCapture, handlePointerCaptureLost)
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorCompletionFunctions.handleScrollBarClick(uid, clientY)
}
