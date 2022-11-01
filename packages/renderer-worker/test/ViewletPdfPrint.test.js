import * as ViewletPdfPrint from '../src/parts/ViewletPdf/ViewletPdfPrint.js'
import * as ViewletPdf from '../src/parts/ViewletPdf/ViewletPdf.js'

test('print', () => {
  const state = ViewletPdf.create()
  expect(() => ViewletPdfPrint.print(state)).toThrowError(
    new Error('not implemented')
  )
})
