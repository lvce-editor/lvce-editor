import * as ViewletEditorImage from '../src/parts/Viewlet/ViewletEditorImage.js'

test('name', () => {
  expect(ViewletEditorImage.name).toBe('EditorImage')
})

test('create', () => {
  const state = ViewletEditorImage.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletEditorImage.create()
  expect(await ViewletEditorImage.loadContent(state)).toMatchObject({
    src: 'abc',
  })
})

test('dispose', () => {
  const state = ViewletEditorImage.create()
  expect(ViewletEditorImage.dispose(state)).toMatchObject({
    disposed: true,
  })
})

test('render', () => {
  const oldState = ViewletEditorImage.create()
  const newState = {
    ...oldState,
    src: '/test/image.png',
  }
  expect(ViewletEditorImage.render(oldState, newState)).toEqual([
    [3024, 'EditorImage', 'setSrc', '/remote/test/image.png'],
  ])
})
