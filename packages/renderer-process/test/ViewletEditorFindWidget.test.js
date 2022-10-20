/**
 * @jest-environment jsdom
 */
import * as ViewletEditorFindWidget from '../src/parts/ViewletEditorFindWidget/ViewletEditorFindWidget.js'

test('name', () => {
  expect(ViewletEditorFindWidget.name).toBe('EditorFindWidget')
})

test('create', () => {
  const state = ViewletEditorFindWidget.create()
  const { $Viewlet } = state
  expect($Viewlet).toBeInstanceOf(HTMLElement)
})

test('accessibility - input field should have aria label', () => {
  const state = ViewletEditorFindWidget.create()
  const { $InputBox } = state
  expect($InputBox.ariaLabel).toBe('Find')
})

test('accessibility - buttons should have tabindex 0', () => {
  const state = ViewletEditorFindWidget.create()
  const { $ButtonClose } = state
  expect($ButtonClose.tabIndex).toBe(0)
})

test('accessibility - buttons should have aria label', () => {
  const state = ViewletEditorFindWidget.create()
  const { $ButtonClose } = state
  expect($ButtonClose.ariaLabel).toBe('Close')
})
test('accessibility - viewlet should have a role of group', () => {
  const state = ViewletEditorFindWidget.create()
  const { $Viewlet } = state
  // @ts-ignore
  expect($Viewlet.role).toBe('group')
})
