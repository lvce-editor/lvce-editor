import { createOffscreenTerminal } from '../../../../../static/js/termterm.js'
import * as Assert from '../Assert/Assert.js'

export const create = ({ offscreenCanvasCursor, offscreenCanvasText }) => {
  Assert.object(offscreenCanvasCursor)
  Assert.object(offscreenCanvasText)
  const terminal = createOffscreenTerminal({
    canvasCursor: offscreenCanvasCursor,
    canvasText: offscreenCanvasText,
  })
  return terminal
}
