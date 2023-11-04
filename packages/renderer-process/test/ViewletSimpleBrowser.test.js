/**
 * @jest-environment jsdom
 */
import * as ViewletSimpleBrowser from '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js'
import * as EnterKeyHintType from '../src/parts/EnterKeyHintType/EnterKeyHintType.js'

test('create', () => {
  const state = ViewletSimpleBrowser.create()
  expect(state).toBeDefined()
})

test('setIframeSrc', () => {
  const state = ViewletSimpleBrowser.create()
  ViewletSimpleBrowser.setIframeSrc(state, 'https://example.com')
  const { $InputBox } = state
  expect($InputBox.value).toBe('https://example.com')
})

test('accessibility - input box should have type url', () => {
  const state = ViewletSimpleBrowser.create()
  const { $InputBox } = state
  expect($InputBox.type).toBe('url')
})

test('accessibility - input box should enterkeyhint attribute', () => {
  const state = ViewletSimpleBrowser.create()
  const { $InputBox } = state
  expect($InputBox.enterKeyHint).toBe(EnterKeyHintType.Go)
})

test('setButtonsEnabled - false', () => {
  const state = ViewletSimpleBrowser.create()
  ViewletSimpleBrowser.setButtonsEnabled(state, false, false)
  const { $ButtonBack, $ButtonForward } = state
  expect($ButtonBack.disabled).toBe(true)
  expect($ButtonForward.disabled).toBe(true)
})
