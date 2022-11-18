/**
 * @jest-environment jsdom
 */
import * as ViewletEditorPlainText from '../src/parts/ViewletEditorPlainText/ViewletEditorPlainText.js'

test('create', () => {
  const state = ViewletEditorPlainText.create()
  expect(state).toBeDefined()
})

test('dispose', () => {
  const state = ViewletEditorPlainText.create()
  ViewletEditorPlainText.dispose(state)
})

test('refresh', () => {
  const state = ViewletEditorPlainText.create()
  ViewletEditorPlainText.refresh(state, {
    content: 'sample text',
  })
  expect(state.$Viewlet.textContent).toBe('sample text')
})
