import { pdfjsLib } from '../Pdfjs/Pdfjs.js'
import * as Document from '../Document/Document.js'

export const state = {
  pages: Object.create(null),
}

export const addCanvas = async (canvasId, canvas, data) => {
  // Prepare canvas using PDF page dimensions
  const context = canvas.getContext('2d', { alpha: false })
  state.pages[canvasId] = {
    page: undefined,
    context,
    canvas,
    viewport: undefined,
  }
}

const getPageState = (id) => {
  const pageState = state.pages[id]
  if (!pageState) {
    throw new Error(`page not found ${id}`)
  }
  return pageState
}

export const setContent = async (id, content) => {
  const pageState = getPageState(id)
  const loadingTask = pdfjsLib.getDocument({
    data: content,
    ownerDocument: Document.document,
  })
  const pdf = await loadingTask.promise

  // Fetch the first page
  const pageNumber = 1
  const page = await pdf.getPage(pageNumber)
  pageState.page = page
  pageState.pdf = pdf
  const numberOfPages = pdf.numPages
  return {
    numberOfPages,
  }
}

export const focusPage = async (id, pageIndex) => {
  const pageState = getPageState(id)
  const { pdf } = pageState
  const page = await pdf.getPage(pageIndex + 1)
  pageState.page = page
}

export const render = async (id) => {
  const pageState = getPageState(id)
  const { context, viewport, page } = pageState
  const renderContext = {
    canvasContext: context,
    viewport,
  }
  const renderTask = page.render(renderContext)
  await renderTask.promise
}

export const resize = async (id, width, height) => {
  const pageState = getPageState(id)
  const { page, canvas, context } = pageState
  // canvas.height = height
  const viewport = page.getViewport({
    scale: width / page.getViewport({ scale: 1 }).width,
  })
  pageState.viewport = viewport
  canvas.width = width
  canvas.height = Math.floor(viewport.height)
  await render(id)
}
