import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  RendererWorker.send('KeyBindings.handleInput', value)
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
  RendererWorker.send('KeyBindings.handleClick', index)
}

const handleWheelDeltaLine = (deltaY) => {
  RendererWorker.send(/* ViewletKeyBindings.handleWheel */ 'KeyBindings.handleWheel', /* deltaY */ deltaY)
}

const handleWheelDeltaPixel = (deltaY) => {
  RendererWorker.send(/* ViewletKeyBindings.handleWheel */ 'KeyBindings.handleWheel', /* deltaY */ deltaY)
}

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  switch (deltaMode) {
    case WheelEventType.DomDeltaLine:
      return handleWheelDeltaLine(deltaY)
    case WheelEventType.DomDeltaPixel:
      return handleWheelDeltaPixel(deltaY)
    default:
      break
  }
}

export const handleResizerPointerMove = (event) => {
  const { clientX } = event
  RendererWorker.send(/* KeyBindings.handleResizerMouseMove */ 'KeyBindings.handleResizerMove', /* y */ clientX)
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
  RendererWorker.send(/* KeyBindings.handleResizerPointerDown */ 'KeyBindings.handleResizerClick', /* id */ id, /* x */ clientX)
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
