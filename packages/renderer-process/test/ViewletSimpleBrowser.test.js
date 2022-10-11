/**
 * @jest-environment jsdom
 */
import * as ViewletSimpleBrowser from '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js'

test('name', () => {
  expect(ViewletSimpleBrowser.name).toBe('SimpleBrowser')
})

test('create', () => {
  const state = ViewletSimpleBrowser.create()
  expect(state).toBeDefined()
})

test('setIframeSrc', () => {
  const state = ViewletSimpleBrowser.create()
  ViewletSimpleBrowser.setIframeSrc(state, 'https://example.com')
  const { $Iframe } = state
  expect($Iframe.src).toBe('https://example.com/')
})
