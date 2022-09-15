import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'

export const handleInput = (event) => {
  const $Target = event.target
  const value = $Target.value
  RendererWorker.send('KeyBindings.handleInput', value)
}

export const handleWheel = (event) => {
  switch (event.deltaMode) {
    case WheelEventType.DomDeltaLine:
      RendererWorker.send(
        /* ViewletKeyBindings.handleWheel */ 'KeyBindings.handleWheel',
        /* deltaY */ event.deltaY
      )
      break
    case WheelEventType.DomDeltaPixel:
      RendererWorker.send(
        /* ViewletKeyBindings.handleWheel */ 'KeyBindings.handleWheel',
        /* deltaY */ event.deltaY
      )
      break
    default:
      break
  }
}
