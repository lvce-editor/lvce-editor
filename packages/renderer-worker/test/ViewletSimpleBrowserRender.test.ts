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

test('restores address input focus while suggestions are visible', () => {
  const newState = {
    ...state,
    suggestions: ['what is'],
  }

  const commands = ViewletSimpleBrowserRender.render[0].apply(state, newState)

  expect(commands.at(-1)).toEqual(['Viewlet.focusElementByName', 'simple-browser-address'])
})

test('does not focus the address input after suggestions close', () => {
  const oldState = {
    ...state,
    suggestions: ['what is'],
  }

  const commands = ViewletSimpleBrowserRender.render[0].apply(oldState, state)

  expect(commands).toHaveLength(1)
})
