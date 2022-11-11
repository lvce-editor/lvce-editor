import * as PdfWorkerFunctions from '../PdfWorkerFunctions/PdfWorkerFunctions.js'

export const focusPage = async (state, page) => {
  const { canvasId, ipc } = state
  await PdfWorkerFunctions.focusPage(ipc, canvasId, page)
  await PdfWorkerFunctions.render(ipc, canvasId)
  return {
    ...state,
    page,
  }
}
