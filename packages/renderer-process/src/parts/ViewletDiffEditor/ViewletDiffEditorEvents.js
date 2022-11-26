import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'

/**
 * @param {WheelEvent} event
 */
export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  // event.preventDefault()
  // const state = EditorHelper.getStateFromEvent(event)
  // TODO send editor id
  switch (deltaMode) {
    case WheelEventType.DomDeltaLine:
      RendererWorker.send(
        /* DiffEditor.handleWheel */ 'DiffEditor.handleWheel',
        /* value */ deltaY
      )
      break
    case WheelEventType.DomDeltaPixel:
      RendererWorker.send(
        /* DiffEditor.handleWheel */ 'DiffEditor.handleWheel',
        /* value */ deltaY
      )
      break
    default:
      break
  }
}

export const handleScrollBarPointerDown = (event) => {
  // TODO
}
