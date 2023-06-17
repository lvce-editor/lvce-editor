import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.js'
import * as ViewletKeyBindingsFunctions from './ViewletKeyBindingsFunctions.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  const uid = ComponentUid.fromEvent(event)
  ViewletKeyBindingsFunctions.handleInput(uid, value)
}

const getTableRowIndex = ($Target) => {
  const { className } = $Target
  switch (className) {
    case 'KeyBindingsTableCell':
      return GetNodeIndex.getNodeIndex($Target.parentNode)
    default:
      return -1
  }
}

export const handleTableClick = (event) => {
  const { target } = event
  const index = getTableRowIndex(target)
  const uid = ComponentUid.fromEvent(event)
  if (index === -1) {
    return
  }
  ViewletKeyBindingsFunctions.handleClick(uid, index)
}

export const handleResizerPointerMove = (event) => {
  const { clientX } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletKeyBindingsFunctions.handleResizerMove(uid, clientX)
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
  const uid = ComponentUid.fromEvent(event)
  ViewletKeyBindingsFunctions.handleResizerClick(uid, id, clientX)
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

export * from '../VirtualListEvents/VirtualListEvents.js'
