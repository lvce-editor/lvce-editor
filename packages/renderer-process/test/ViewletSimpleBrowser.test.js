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
  expect($InputBox.enterKeyHint).toBe('go')
})

test('setButtonsEnabled - false', () => {
  const state = ViewletSimpleBrowser.create()
  ViewletSimpleBrowser.setButtonsEnabled(state, false, false)
  const { $ButtonBack, $ButtonForward } = state
  expect($ButtonBack.disabled).toBe(true)
  expect($ButtonForward.disabled).toBe(true)
})

test('setLoading - true', () => {
  const state = ViewletSimpleBrowser.create()
  ViewletSimpleBrowser.setLoading(state, true)
  const { $ButtonReload } = state
  expect($ButtonReload.title).toBe('Cancel')
  const $Icon = $ButtonReload.firstChild
  // @ts-ignore
  expect($Icon.style.maskImage).toBe("url('/icons/close.svg')")
})
