import * as PdfWorker from '../PdfWorker/PdfWorker.js'

export const focusPage = async (state, page) => {
  const { canvasId, ipc } = state
  await PdfWorker.invoke(ipc, 'Canvas.focusPage', canvasId, page)
  await PdfWorker.invoke(ipc, 'Canvas.render', canvasId)
  return {
    ...state,
    page,
  }
}
