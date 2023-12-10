/**
 * @jest-environment jsdom
 */
import * as ViewletFindWidget from '../src/parts/ViewletFindWidget/ViewletFindWidget.js'

test('create', () => {
  const state = ViewletFindWidget.create()
  const { $Viewlet } = state
  expect($Viewlet).toBeInstanceOf(HTMLElement)
})

test('accessibility - input field should have aria label', () => {
  const state = ViewletFindWidget.create()
  const { $InputBox } = state
  expect($InputBox.ariaLabel).toBe('Find')
})

test('accessibility - viewlet should have a role of group', () => {
  const state = ViewletFindWidget.create()
  const { $Viewlet } = state
  expect($Viewlet.role).toBe('group')
})
