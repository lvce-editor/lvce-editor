import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleMouseDown = (event) => {
  event.preventDefault()
  RendererWorker.send(/* ViewletProblems.focusIndex */ 7550, /* index */ -1)
}
