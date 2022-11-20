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

test('accessibility - buttons should have tabindex 0', () => {
  const state = ViewletFindWidget.create()
  const { $ButtonClose } = state
  expect($ButtonClose.tabIndex).toBe(0)
})

test('accessibility - buttons should have title', () => {
  const state = ViewletFindWidget.create()
  const { $ButtonClose } = state
  expect($ButtonClose.title).toBe('Close')
})

test('accessibility - viewlet should have a role of group', () => {
  const state = ViewletFindWidget.create()
  const { $Viewlet } = state
  // @ts-ignore
  expect($Viewlet.role).toBe('group')
})

test('setButtonsEnabled - false', () => {
  const state = ViewletFindWidget.create()
  ViewletFindWidget.setButtonsEnabled(state, false)
  const { $ButtonFocusNext, $ButtonFocusPrevious } = state
  expect($ButtonFocusNext.disabled).toBe(true)
  expect($ButtonFocusPrevious.disabled).toBe(true)
})
