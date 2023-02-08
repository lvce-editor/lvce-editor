import * as DomEventType from '../DomEventType/DomEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleSliderPointerCaptureLost = (event) => {
  const { target } = event
  target.removeEventListener(DomEventType.PointerMove, handleSliderPointerMove)
  target.removeEventListener(DomEventType.LostPointerCapture, handleSliderPointerCaptureLost)
}

export const handleSliderPointerMove = (event) => {
  const { clientX, clientY } = event
  RendererWorker.send('ColorPicker.handleSliderPointerMove', /* x */ clientX, /* y */ clientY)
}

export const handleSliderPointerDown = (event) => {
  const { clientX, clientY, target, pointerId } = event
  target.setPointerCapture(pointerId)
  target.addEventListener(DomEventType.PointerMove, handleSliderPointerMove)
  target.addEventListener(DomEventType.LostPointerCapture, handleSliderPointerCaptureLost)
  RendererWorker.send('ColorPicker.handleSliderPointerDown', /* x */ clientX, /* y */ clientY)
}
