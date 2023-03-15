export const name = 'Pdf'

export const LazyCommands = {
  previous: () => import('./ViewletPdfPrevious.js'),
  next: () => import('./ViewletPdfNext.js'),
  focusPage: () => import('./ViewletPdfFocusPage.js'),
  zoomIn: () => import('./ViewletPdfZoomIn.js'),
  zoomOut: () => import('./ViewletPdfZoomOut.js'),
  print: () => import('./ViewletPdfPrint.js'),
}

export * from './ViewletPdfCss.js'
export * from './ViewletPdf.js'
