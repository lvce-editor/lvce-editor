/**
 * @jest-environment jsdom
 */
import * as ViewletEditorCompletion from '../src/parts/ViewletEditorCompletion/ViewletEditorCompletion.js'

test('create', () => {
  const state = ViewletEditorCompletion.create()
  expect(state).toBeDefined()
})
