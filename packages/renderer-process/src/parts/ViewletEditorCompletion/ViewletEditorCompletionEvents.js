import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as Event from '../Event/Event.js'
import * as PointerEvents from '../PointerEvents/PointerEvents.js'
import * as ViewletEditorCompletionFunctions from './ViewletEditorCompletionFunctions.js'

export const handleMousedown = (event) => {
  Event.preventDefault(event)
  const { clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorCompletionFunctions.handleClickAt(uid, clientX, clientY)
}

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorCompletionFunctions.handleScrollBarThumbPointerMove(uid, clientY)
}

const handlePointerCaptureLost = (event) => {
  const { target, pointerId } = event
  PointerEvents.stopTracking(target, pointerId, handleScrollBarThumbPointerMove, handlePointerCaptureLost)
}

export const handleScrollBarPointerDown = (event) => {
  Event.preventDefault(event)
  const { target, pointerId, clientY } = event
  PointerEvents.startTracking(target, pointerId, handleScrollBarThumbPointerMove, handlePointerCaptureLost)
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorCompletionFunctions.handleScrollBarClick(uid, clientY)
}

export * from '../VirtualListEvents/VirtualListEvents.js'
