import * as ViewletEditorFind from '../src/parts/ViewletEditorFindWidget/ViewletEditorFindWidget.js'

test('name', () => {
  expect(ViewletEditorFind.name).toBe('EditorFind')
})

test('create', () => {
  expect(ViewletEditorFind.create()).toBeDefined()
})

test('getPosition', () => {
  // TODO compute position based on currently focused editor
  // if there is no editor, do nothing
})

test('loadContent', async () => {
  const state = ViewletEditorFind.create()
  expect(await ViewletEditorFind.loadContent(state)).toEqual({})
})
