/**
 * @jest-environment jsdom
 */
import * as ViewletSearch from '../src/parts/ViewletSearch/ViewletSearch.js'

test('name', () => {
  expect(ViewletSearch.name).toBe('Search')
})

test('create', () => {
  const state = ViewletSearch.create()
  expect(state).toBeDefined()
})

test('refresh', () => {
  const state = ViewletSearch.create()
  ViewletSearch.refresh(state)
})

test('setResults - no results', () => {
  const state = ViewletSearch.create()
  ViewletSearch.setResults(state, [])
  expect(state.$SearchResults.children).toHaveLength(0)
})

test('setResults - one result in one file', () => {
  const state = ViewletSearch.create()
  ViewletSearch.setResults(state, [
    {
      name: './result-1.txt',
    },
  ])
  expect(state.$SearchResults.children).toHaveLength(1)
})

test('setResults - multiple results in one file', () => {
  const state = ViewletSearch.create()
  ViewletSearch.setResults(state, [
    {
      name: './result-1.txt',
    },
  ])
  expect(state.$SearchResults.children).toHaveLength(1)
})

test('setResults - multiple results in multiple files', () => {
  const state = ViewletSearch.create()
  ViewletSearch.setResults(state, [
    {
      name: './result-1.txt',
    },
    {
      name: './result-2.txt',
    },
  ])
  expect(state.$SearchResults.children).toHaveLength(2)
})
