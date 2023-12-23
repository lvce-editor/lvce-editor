/**
 * @jest-environment jsdom
 */
import * as ViewletEditorImage from '../src/parts/ViewletEditorImage/ViewletEditorImage.js'

test('create', () => {
  const state = ViewletEditorImage.create()
  expect(state).toBeDefined()
})
