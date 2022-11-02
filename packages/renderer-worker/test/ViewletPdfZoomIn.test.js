import * as ViewletPdfZoomIn from '../src/parts/ViewletPdf/ViewletPdfZoomIn.js'
import * as ViewletPdf from '../src/parts/ViewletPdf/ViewletPdf.js'

test('zoomIn', () => {
  const state = ViewletPdf.create()
  expect(() => ViewletPdfZoomIn.zoomIn(state)).toThrowError(
    new Error('not implemented')
  )
})
