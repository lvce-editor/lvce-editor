export const name = 'Pdf'

export const LazyCommands = {
  previous: () => import('./ViewletPdfPrevious.js'),
  next: () => import('./ViewletPdfNext.js'),
  focusPage: () => import('./ViewletPdfFocusPage.js'),
  zoomIn: () => import('./ViewletPdfZoomIn.js'),
  zoomOut: () => import('./ViewletPdfZoomOut.js'),
  print: () => import('./ViewletPdfPrint.js'),
}

export const Css = [
  '/css/parts/ViewletPdf.css',
  '/css/parts/IconButton.css',
  '/css/parts/InputBox.css',
]

export * from './ViewletPdf.js'
