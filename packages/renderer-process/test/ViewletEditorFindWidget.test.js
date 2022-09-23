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
