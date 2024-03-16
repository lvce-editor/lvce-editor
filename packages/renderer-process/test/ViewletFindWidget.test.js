/**
 * @jest-environment jsdom
 */
import * as ViewletFindWidget from '../src/parts/ViewletFindWidget/ViewletFindWidget.js'

test('create', () => {
  const state = ViewletFindWidget.create()
  const { $Viewlet } = state
  expect($Viewlet).toBeInstanceOf(HTMLElement)
})
