import * as ViewletPdfZoomOut from '../src/parts/ViewletPdf/ViewletPdfZoomOut.js'
import * as ViewletPdf from '../src/parts/ViewletPdf/ViewletPdf.js'

test('zoomOut', () => {
  const state = ViewletPdf.create()
  expect(() => ViewletPdfZoomOut.zoomOut(state)).toThrowError(
    new Error('not implemented')
  )
})
