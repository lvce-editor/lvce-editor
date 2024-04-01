import * as DomEventType from '../DomEventType/DomEventType.ts'

export const startTracking = ($Target, pointerId, handlePointerMove, handlePointerUp) => {
  $Target.setPointerCapture(pointerId)
  $Target.addEventListener(DomEventType.PointerMove, handlePointerMove)
  // TODO use pointerlost event instead
  $Target.addEventListener(DomEventType.PointerUp, handlePointerUp)
}

export const stopTracking = ($Target, pointerId, handlePointerMove, handlePointerUp) => {
  $Target.releasePointerCapture(pointerId)
  $Target.removeEventListener(DomEventType.PointerMove, handlePointerMove)
  // TODO use pointerlost event instead
  $Target.removeEventListener(DomEventType.PointerUp, handlePointerUp)
}
