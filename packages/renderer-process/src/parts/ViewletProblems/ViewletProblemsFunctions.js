import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const focusIndex = (index) => {
  RendererWorker.send(/* Problems.focusIndex */ 'Problems.focusIndex', /* index */ -1)
}
