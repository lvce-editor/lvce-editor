import * as Assert from '../Assert/Assert.ts'

export const create = async ({ offscreenCanvasCursor, offscreenCanvasText, focusTextArea, handleInput }) => {
  Assert.object(offscreenCanvasCursor)
  Assert.object(offscreenCanvasText)
  // @ts-ignore
  const { createOffscreenTerminal } = await import('../../../../../static/js/termterm.js')
  const terminal = createOffscreenTerminal({
    canvasCursor: offscreenCanvasCursor,
    canvasText: offscreenCanvasText,
    focusTextArea,
    handleInput,
  })
  return terminal
}
