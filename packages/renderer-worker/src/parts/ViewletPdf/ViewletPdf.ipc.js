import * as ViewletPdf from './ViewletPdf.js'

// prettier-ignore
export const Commands = {
  'Pdf.previous': ViewletPdf.previous,
  'Pdf.next': ViewletPdf.next,
  'Pdf.print': ViewletPdf.print,
  'Pdf.zoomIn': ViewletPdf.zoomIn,
  'Pdf.zoomOut': ViewletPdf.zoomOut,
}

export const Css = '/css/parts/ViewletPdf.css'

export * from './ViewletPdf.js'
