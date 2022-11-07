import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'

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
  RendererWorker.send(
    /* ViewletKeyBindings.handleWheel */ 'KeyBindings.handleWheel',
    /* deltaY */ deltaY
  )
}

const handleWheelDeltaPixel = (deltaY) => {
  RendererWorker.send(
    /* ViewletKeyBindings.handleWheel */ 'KeyBindings.handleWheel',
    /* deltaY */ deltaY
  )
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

export const handleScrollBarPointerDown = (event) => {
  // TODO
}
