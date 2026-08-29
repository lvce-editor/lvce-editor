import { expect, test } from '@jest/globals'
import * as ViewletSimpleBrowserHistory from '../src/parts/ViewletSimpleBrowserHistory/ViewletSimpleBrowserHistory.js'

test('create', () => {
  expect(ViewletSimpleBrowserHistory.create(12, 'simple-browser-history://')).toEqual({
    uid: 12,
    uri: 'simple-browser-history://',
    loaded: false,
    searchValue: '',
  })
})

test('loadContent', () => {
  const state = ViewletSimpleBrowserHistory.create(12, 'simple-browser-history://')

  expect(ViewletSimpleBrowserHistory.loadContent(state)).toEqual({
    ...state,
    loaded: true,
  })
})

test('handleInput', () => {
  const state = ViewletSimpleBrowserHistory.create(12, 'simple-browser-history://')

  expect(ViewletSimpleBrowserHistory.handleInput(state, 'example')).toEqual({
    ...state,
    searchValue: 'example',
  })
})

test('clearHistory is a placeholder', () => {
  const state = ViewletSimpleBrowserHistory.create(12, 'simple-browser-history://')

  expect(ViewletSimpleBrowserHistory.clearHistory(state)).toBe(state)
})
