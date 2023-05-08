import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as VirtualListFunctions from '../VirtualListFunctions/VirtualListFunctions.js'

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  const uid = ComponentUid.fromEvent(event)
  VirtualListFunctions.handleScrollBarThumbPointerMove(uid, clientY)
}

const handleScrollBarPointerCaptureLost = (event) => {
  const { target } = event
  target.removeEventListener(DomEventType.PointerMove, handleScrollBarThumbPointerMove)
}

export const handleScrollBarPointerDown = (event) => {
  const { target, pointerId, clientY } = event
  target.setPointerCapture(pointerId)
  target.addEventListener(DomEventType.PointerMove, handleScrollBarThumbPointerMove, DomEventOptions.Active)
  target.addEventListener(DomEventType.LostPointerCapture, handleScrollBarPointerCaptureLost)
  const uid = ComponentUid.fromEvent(event)
  VirtualListFunctions.handleScrollBarPointerDown(uid, clientY)
}

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  const uid = ComponentUid.fromEvent(event)
  VirtualListFunctions.handleWheel(uid, deltaMode, deltaY)
}
