import * as ViewletExtensionDetail from '../src/parts/ViewletExtensionDetail/ViewletExtensionDetail.js'

test('name', () => {
  expect(ViewletExtensionDetail.name).toBe('ExtensionDetail')
})

test('create', () => {
  const state = ViewletExtensionDetail.create()
  expect(state).toBeDefined()
})

test('loadContent', () => {
  const state = ViewletExtensionDetail.create()
  expect(ViewletExtensionDetail.loadContent(state)).toMatchObject({})
})
