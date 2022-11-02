/**
 * @jest-environment jsdom
 */
import * as ViewletPdf from '../src/parts/ViewletPdf/ViewletPdf.js'

test('create', () => {
  const state = ViewletPdf.create()
  expect(state).toBeDefined()
})
