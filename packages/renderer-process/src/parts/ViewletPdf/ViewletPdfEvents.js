import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleClickPrevious = () => {
  RendererWorker.send('Pdf.previous')
}

export const handleClickNext = () => {
  RendererWorker.send('Pdf.next')
}

export const handleClickZoomIn = () => {
  RendererWorker.send('Pdf.zoomIn')
}

export const handleClickZoomOut = () => {
  RendererWorker.send('Pdf.zoomOut')
}

export const handleClickPrint = () => {
  RendererWorker.send('Pdf.print')
}
