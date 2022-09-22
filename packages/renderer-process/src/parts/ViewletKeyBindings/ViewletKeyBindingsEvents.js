import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'

export const handleInput = (event) => {
  const $Target = event.target
  const value = $Target.value
  RendererWorker.send('KeyBindings.handleInput', value)
}

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  switch (deltaMode) {
    case WheelEventType.DomDeltaLine:
      RendererWorker.send(
        /* ViewletKeyBindings.handleWheel */ 'KeyBindings.handleWheel',
        /* deltaY */ deltaY
      )
      break
    case WheelEventType.DomDeltaPixel:
      RendererWorker.send(
        /* ViewletKeyBindings.handleWheel */ 'KeyBindings.handleWheel',
        /* deltaY */ deltaY
      )
      break
    default:
      break
  }
}
