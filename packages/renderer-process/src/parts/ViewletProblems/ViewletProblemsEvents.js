import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Event from '../Event/Event.js'

export const handlePointerDown = (event) => {
  Event.preventDefault(event)
  RendererWorker.send(/* Problems.focusIndex */ 'Problems.focusIndex', /* index */ -1)
}
