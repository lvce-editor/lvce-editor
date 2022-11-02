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
  'Pdf.next': LazyCommand.create(ViewletPdf.name, Imports.Next, 'next'),
  'Pdf.previous': LazyCommand.create(ViewletPdf.name, Imports.Previous, 'previous'),
  'Pdf.print': LazyCommand.create(ViewletPdf.name, Imports.Print, 'print' ),
  'Pdf.zoomIn': LazyCommand.create(ViewletPdf.name, Imports.ZoomIn, 'zoomIn'),
  'Pdf.zoomOut': LazyCommand.create(ViewletPdf.name, Imports.ZoomOut, 'zoomOut'),
}

export const Css = '/css/parts/ViewletPdf.css'

export * from './ViewletPdf.js'
