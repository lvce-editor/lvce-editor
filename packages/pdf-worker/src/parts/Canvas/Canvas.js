import { pdfjsLib } from '../Pdfjs/Pdfjs.js'
import * as Document from '../Document/Document.js'

export const state = {
  pages: Object.create(null),
}

export const addCanvas = async (canvasId, canvas, data) => {
  const loadingTask = pdfjsLib.getDocument({
    data,
    ownerDocument: Document.document,
  })
  const pdf = await loadingTask.promise

  // Fetch the first page
  const pageNumber = 1
  const page = await pdf.getPage(pageNumber)

  console.log('Page loaded')

  const scale = 1.5
  const viewport = page.getViewport({ scale })

  // Prepare canvas using PDF page dimensions
  const context = canvas.getContext('2d', { alpha: false })

  canvas.height = viewport.height
  canvas.width = viewport.width

  // Render PDF page into canvas context
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  }
  const renderTask = page.render(renderContext)
  await renderTask.promise

  // postMessage('canvas', canvas./)
  console.log('Page rendered')

  state.pages[canvasId] = { page, renderContext, pdf }
}

export const focusPage = async (id, pageNumber) => {
  const pageState = state.pages[id]
  if (!pageState) {
    throw new Error(`page not found ${id}`)
  }
  const { renderContext, pdf } = pageState
  const page = await pdf.getPage(pageNumber)
  const renderTask = page.render(renderContext)
  await renderTask.promise
}
