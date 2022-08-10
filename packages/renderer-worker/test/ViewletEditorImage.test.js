import * as ViewletEditorImage from '../src/parts/ViewletEditorImage/ViewletEditorImage.js'

const ViewletManager = await import(
  '../src/parts/ViewletManager/ViewletManager.js'
)

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletEditorImage, oldState, newState)
}

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
  expect(render(oldState, newState)).toEqual([
    ['Viewlet.send', 'EditorImage', 'setSrc', '/remote/test/image.png'],
  ])
})
