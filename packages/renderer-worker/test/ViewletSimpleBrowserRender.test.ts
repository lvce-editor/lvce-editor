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
