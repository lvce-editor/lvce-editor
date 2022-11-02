import { pdfjsLib } from '../Pdfjs/Pdfjs.js'
import * as Document from '../Document/Document.js'

export const state = {
  pages: Object.create(null),
}

export const addCanvas = async (canvasId, canvas, data) => {
  // Prepare canvas using PDF page dimensions
  const context = canvas.getContext('2d', {
    alpha: false,
    desynchronized: true,
  })
  state.pages[canvasId] = {
    page: undefined,
    originalContext: context,
    originalCanvas: canvas,
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
  const { originalCanvas, originalContext, viewport, page, canvas, context } =
    pageState
  // @ts-ignore
  const newCanvas = new OffscreenCanvas(
    originalCanvas.width,
    originalCanvas.height
  )
  const newContext = newCanvas.getContext('2d', {
    alpha: false,
    desynchronized: true,
  })
  const renderContext = {
    canvasContext: newContext,
    viewport,
  }
  pageState.canvas = newCanvas
  pageState.context = newContext
  const newRenderTask = page.render(renderContext)
  await newRenderTask.promise
  if (pageState.canvas !== newCanvas) {
    console.info('canceled')
    return
  }
  originalContext.drawImage(newCanvas, 0, 0)
  console.log('render')
}

export const resize = async (id, width, height) => {
  const pageState = getPageState(id)
  const { page, originalCanvas, originalContext } = pageState
  // canvas.height = height
  const viewport = page.getViewport({
    scale: width / page.getViewport({ scale: 1 }).width,
  })
  pageState.viewport = viewport
  originalCanvas.width = width
  originalCanvas.height = Math.floor(viewport.height)
  await render(id)
}
