import { expect, test } from '@jest/globals'
import * as ViewletSimpleBrowserRender from '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserRender.js'

const state = {
  canGoBack: false,
  canGoForward: false,
  iframeSrc: 'https://example.com',
  inputValue: 'w',
  isLoading: false,
  selectedSuggestionIndex: -1,
  snapshot: '',
  suggestions: [],
  uid: 42,
}

test('does not rerender the native address input while typing', () => {
  const newState = {
    ...state,
    inputValue: 'wh',
  }

  expect(ViewletSimpleBrowserRender.render[0].isEqual(state, newState)).toBe(true)
})

test('rerenders when suggestions change', () => {
  const newState = {
    ...state,
    suggestions: ['what is'],
  }

  expect(ViewletSimpleBrowserRender.render[0].isEqual(state, newState)).toBe(false)
})

test('restores address input focus while suggestions are visible', () => {
  const newState = {
    ...state,
    suggestions: ['what is'],
  }

  const commands = ViewletSimpleBrowserRender.render[0].apply(state, newState)

  expect(commands[0].slice(0, 2)).toEqual(['Viewlet.setDom2', 42])
  expect(commands.at(-1)).toEqual(['Viewlet.focusElementByName', 42, 'simple-browser-address'])
})

test('does not focus the address input after suggestions close', () => {
  const oldState = {
    ...state,
    suggestions: ['what is'],
  }

  const commands = ViewletSimpleBrowserRender.render[0].apply(oldState, state)

  expect(commands).toHaveLength(1)
})

test('focuses the address input for a new empty tab', () => {
  const oldState = { ...state, focusAddressVersion: 0 }
  const newState = { ...state, focusAddressVersion: 1 }

  expect(ViewletSimpleBrowserRender.render[2].isEqual(oldState, newState)).toBe(false)
  expect(ViewletSimpleBrowserRender.render[2].apply(oldState, newState)).toEqual(['Viewlet.focusElementByName', 42, 'simple-browser-address'])
})
