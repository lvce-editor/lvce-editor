import * as ViewletPdf from '../src/parts/ViewletPdf/ViewletPdf.js'

test('create', () => {
  const state = ViewletPdf.create()
  expect(state).toBeDefined()
})

test('text', () => {
  const state = ViewletPdf.create()
  const { $Viewlet } = state
  expect($Viewlet.textContent).toBe('pdf')
})
