import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handlePointerDown = (event) => {
  event.preventDefault()
  RendererWorker.send(
    /* Problems.focusIndex */ 'Problems.focusIndex',
    /* index */ -1
  )
}
