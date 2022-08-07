import * as ViewletIframe from '../src/parts/ViewletIframe/ViewletIframe.js'

test('name', () => {
  expect(ViewletIframe.name).toBe('Iframe')
})

test('create', () => {
  const state = ViewletIframe.create(0)
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletIframe.create(0)
  expect(
    await ViewletIframe.loadContent(state, 'test://example.com')
  ).toMatchObject({
    src: 'test://example.com',
  })
})

test('dispose', () => {
  const state = ViewletIframe.create(0)
  expect(ViewletIframe.dispose(state)).toMatchObject({
    disposed: true,
  })
})

test('render', () => {
  const oldState = ViewletIframe.create()
  const newState = {
    ...oldState,
    src: 'test://example.com',
  }
  expect(ViewletIframe.render(oldState, newState)).toEqual([
    ['Viewlet.send', 'Iframe', 'setSrc', 'test://example.com'],
  ])
})
