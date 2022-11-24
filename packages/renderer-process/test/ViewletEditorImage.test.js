/**
 * @jest-environment jsdom
 */
import * as ViewletEditorImage from '../src/parts/ViewletEditorImage/ViewletEditorImage.js'

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
  ViewletEditorImage.setSrc(state, '/tmp/some-file.png')
})
