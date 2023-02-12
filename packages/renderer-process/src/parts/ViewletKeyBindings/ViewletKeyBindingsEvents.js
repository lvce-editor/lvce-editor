import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'
import * as ViewletKeyBindingsFunctions from './ViewletKeyBindingsFunctions.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  ViewletKeyBindingsFunctions.handleInput(value)
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getTableRowIndex = ($Target) => {
  const { className } = $Target
  switch (className) {
    case 'KeyBindingsTableCell':
      return getNodeIndex($Target.parentNode)
    default:
      return -1
  }
}

export const handleTableClick = (event) => {
  const { target } = event
  const index = getTableRowIndex(target)
  if (index === -1) {
    return
  }
  ViewletKeyBindingsFunctions.handleClick(index)
}

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  switch (deltaMode) {
    case WheelEventType.DomDeltaLine:
    case WheelEventType.DomDeltaPixel:
      return ViewletKeyBindingsFunctions.handleWheel(deltaY)
    default:
      break
  }
}

export const handleResizerPointerMove = (event) => {
  const { clientX } = event
  ViewletKeyBindingsFunctions.handleResizerMove(clientX)
}

// TODO use lostpointercapture event instead
export const handleResizerPointerUp = (event) => {
  const { target, pointerId } = event
  target.releasePointerCapture(pointerId)
  target.removeEventListener(DomEventType.PointerMove, handleResizerPointerMove)
  target.removeEventListener(DomEventType.PointerUp, handleResizerPointerUp)
}

export const handleResizerPointerDown = (event) => {
  const { target, pointerId, clientX } = event
  console.log({ target })
  target.setPointerCapture(pointerId)
  target.addEventListener(DomEventType.PointerMove, handleResizerPointerMove, DomEventOptions.Active)
  target.addEventListener(DomEventType.PointerUp, handleResizerPointerUp)
  const id = target.nextSibling ? 1 : 2
  ViewletKeyBindingsFunctions.handlResizerClick(id, clientX)
}

const getPointerDownFunction = (event) => {
  const { target } = event
  switch (target.className) {
    case 'Resizer':
      return handleResizerPointerDown
    case 'KeyBindingsTableWrapper':
      return handleTableClick
    default:
      return undefined
  }
}

export const handlePointerDown = (event) => {
  const pointerDownFunction = getPointerDownFunction(event)
  if (!pointerDownFunction) {
    return
  }
  pointerDownFunction(event)
}
