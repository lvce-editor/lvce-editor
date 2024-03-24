import * as Assert from '../Assert/Assert.js'

export const create = async ({ offscreenCanvasCursor, offscreenCanvasText, focusTextArea, handleInput }) => {
  Assert.object(offscreenCanvasCursor)
  Assert.object(offscreenCanvasText)
  const { createOffscreenTerminal } = await import('../../../../../static/js/termterm.js')
  const terminal = createOffscreenTerminal({
    canvasCursor: offscreenCanvasCursor,
    canvasText: offscreenCanvasText,
    focusTextArea,
    handleInput,
  })
  return terminal
}
