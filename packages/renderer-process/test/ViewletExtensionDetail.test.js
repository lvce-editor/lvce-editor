/**
 * @jest-environment jsdom
 */
import * as ViewletExtensionDetail from '../src/parts/ViewletExtensionDetail/ViewletExtensionDetail.js'

test('name', () => {
  expect(ViewletExtensionDetail.name).toBe('ExtensionDetail')
})

test('create', () => {
  const state = ViewletExtensionDetail.create()
  expect(state).toBeDefined()
})

test('setName', () => {
  const state = ViewletExtensionDetail.create()
  ViewletExtensionDetail.setName(state, 'test name')
  const { $NameText } = state
  expect($NameText.nodeValue).toBe('test name')
})

test('accessibility - icon should have empty alt attribute', () => {
  const state = ViewletExtensionDetail.create()
  const { $ExtensionDetailIcon } = state
  expect($ExtensionDetailIcon.getAttribute('alt')).toBe('')
})
