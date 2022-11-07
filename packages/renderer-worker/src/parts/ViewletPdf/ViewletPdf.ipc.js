import * as ViewletPdf from './ViewletPdf.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

const Imports = {
  Previous: () => import('./ViewletPdfPrevious.js'),
  Next: () => import('./ViewletPdfNext.js'),
  FocusPage: () => import('./ViewletPdfFocusPage.js'),
  ZoomIn: () => import('./ViewletPdfZoomIn.js'),
  ZoomOut: () => import('./ViewletPdfZoomOut.js'),
  Print: () => import('./ViewletPdfPrint.js'),
}

// prettier-ignore
export const Commands = {
  next: LazyCommand.create(ViewletPdf.name, Imports.Next, 'next'),
  previous: LazyCommand.create(ViewletPdf.name, Imports.Previous, 'previous'),
  print: LazyCommand.create(ViewletPdf.name, Imports.Print, 'print' ),
  zoomIn: LazyCommand.create(ViewletPdf.name, Imports.ZoomIn, 'zoomIn'),
  zoomOut: LazyCommand.create(ViewletPdf.name, Imports.ZoomOut, 'zoomOut'),
}

export const Css = '/css/parts/ViewletPdf.css'

export * from './ViewletPdf.js'
