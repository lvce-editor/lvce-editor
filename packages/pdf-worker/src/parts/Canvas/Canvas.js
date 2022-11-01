import { pdfData } from '../PdfData/PdfData.js'
import { pdfjsLib } from '../Pdfjs/Pdfjs.js'

export const addCanvas = async (canvas) => {
  const loadingTask = pdfjsLib.getDocument({ data: pdfData })
  const pdf = await loadingTask.promise

  // Fetch the first page
  const pageNumber = 1
  const page = await pdf.getPage(pageNumber)

  console.log('Page loaded')

  const scale = 1.5
  const viewport = page.getViewport({ scale: scale })

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
}
