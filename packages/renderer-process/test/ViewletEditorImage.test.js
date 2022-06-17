/**
 * @jest-environment jsdom
 */
import * as ViewletEditorImage from '../src/parts/Viewlet/ViewletEditorImage.js'

test('name', () => {
  expect(ViewletEditorImage.name).toBe('EditorImage')
})

test('create', () => {
  const state = ViewletEditorImage.create()
  expect(state).toBeDefined()
})

test('dispose', () => {
  const state = ViewletEditorImage.create()
  ViewletEditorImage.dispose(state)
})

test('refresh', () => {
  const state = ViewletEditorImage.create()
  ViewletEditorImage.refresh(state, {
    src: '/tmp/some-file.png',
  })
})
