import { expect, test } from '@jest/globals'
import * as ViewletSimpleBrowserHistoryRender from '../src/parts/ViewletSimpleBrowserHistory/ViewletSimpleBrowserHistoryRender.js'

const entries = [
  { date: 200, url: 'https://example.com' },
  { date: 100, url: 'https://other.example' },
]

const state = {
  entries,
  loaded: true,
  searchValue: '',
  uid: 42,
}

test('renders the initial history dom in full', () => {
  const oldState = { ...state, loaded: false, entries: [] }

  expect(ViewletSimpleBrowserHistoryRender.render[0].isEqual(oldState, state)).toBe(false)
  expect(ViewletSimpleBrowserHistoryRender.render[0].apply(oldState, state)[0]).toBe('Viewlet.setDom2')
})

test('updates history incrementally while typing', () => {
  const newState = { ...state, searchValue: 'example.com' }

  const command = ViewletSimpleBrowserHistoryRender.render[0].apply(state, newState)

  expect(command[0]).toBe('Viewlet.setTreePatches')
  expect(command[1]).not.toHaveLength(0)
  expect(command[1]).not.toContainEqual(expect.objectContaining({ key: 'value' }))
})

test('updates filtering and empty state incrementally', () => {
  const filteredState = { ...state, searchValue: 'missing' }
  const unfilteredState = { ...state, searchValue: 'other' }

  const toEmptyCommand = ViewletSimpleBrowserHistoryRender.render[0].apply(state, filteredState)
  const fromEmptyCommand = ViewletSimpleBrowserHistoryRender.render[0].apply(filteredState, unfilteredState)

  expect(toEmptyCommand[0]).toBe('Viewlet.setTreePatches')
  expect(fromEmptyCommand[0]).toBe('Viewlet.setTreePatches')
  expect(toEmptyCommand[1]).not.toHaveLength(0)
  expect(fromEmptyCommand[1]).not.toHaveLength(0)
  expect(toEmptyCommand[1]).not.toContainEqual(expect.objectContaining({ key: 'value' }))
  expect(fromEmptyCommand[1]).not.toContainEqual(expect.objectContaining({ key: 'value' }))
})
