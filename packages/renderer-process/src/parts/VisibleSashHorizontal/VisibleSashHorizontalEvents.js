import * as DomEventType from '../DomEventType/DomEventType.js'
import * as VisibleSashHorizontalFunctions from './VisibleSashHorizontalFunctions.js'

const handleSashPointerMove = (event) => {
  const { clientX, clientY, target } = event
  VisibleSashHorizontalFunctions.handleSashPointerMove(clientX, clientY)
}

const handleSashPointerCaptureLost = (event) => {
  const { target } = event
  target.removeEventListener(DomEventType.PointerMove, handleSashPointerMove)
  target.removeEventListener(DomEventType.LostPointerCapture, handleSashPointerCaptureLost)
}

export const handleSashPointerDown = (event) => {
  const { clientX, clientY, target, pointerId } = event
  target.setPointerCapture(pointerId)
  target.addEventListener(DomEventType.PointerMove, handleSashPointerMove)
  target.addEventListener(DomEventType.LostPointerCapture, handleSashPointerCaptureLost)
  VisibleSashHorizontalFunctions.handleSashPointerDown(clientX, clientY)
}
