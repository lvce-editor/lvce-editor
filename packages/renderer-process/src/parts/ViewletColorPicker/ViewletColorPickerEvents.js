import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as PointerEvents from '../PointerEvents/PointerEvents.js'
import * as ViewletColorPickerFunctions from './ViewletColorPickerFunctions.js'

export const handleSliderPointerCaptureLost = (event) => {
  const { target, pointerId } = event
  PointerEvents.stopTracking(target, pointerId, handleSliderPointerMove, handleSliderPointerCaptureLost)
}

export const handleSliderPointerMove = (event) => {
  const { clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletColorPickerFunctions.handleSliderPointerMove(uid, clientX - 20, clientY)
}

export const handleSliderPointerDown = (event) => {
  const { clientX, clientY, target, pointerId } = event
  PointerEvents.startTracking(target, pointerId, handleSliderPointerMove, handleSliderPointerCaptureLost)
  const uid = ComponentUid.fromEvent(event)
  ViewletColorPickerFunctions.handleSliderPointerDown(uid, clientX - 20, clientY)
}
