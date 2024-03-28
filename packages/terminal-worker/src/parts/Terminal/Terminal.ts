import * as TerminalProcess from '../TerminalProcess/TerminalProcess.ts'

export const create = async (canvasText: OffscreenCanvas, canvasCursor: OffscreenCanvas) => {
  await TerminalProcess.listen()
  console.log({ canvasText, canvasCursor })
}
