import * as ViewletSimpleBrowser from '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js'

test('name', () => {
  expect(ViewletSimpleBrowser.name).toBe('SimpleBrowser')
})

test('create', () => {
  const state = ViewletSimpleBrowser.create()
  expect(state).toBeDefined()
})

test('loadContent', () => {
  const state = ViewletSimpleBrowser.create()
  expect(ViewletSimpleBrowser.loadContent(state)).toMatchObject({
    iframeSrc: 'https://example.com',
  })
})
