/**
 * @jest-environment jsdom
 */
import * as ViewletSearch from '../src/parts/ViewletSearch/ViewletSearch.js'

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
  const { $ListItems } = state
  expect($ListItems.children).toHaveLength(0)
})

test('setResults - one result in one file', () => {
  const state = ViewletSearch.create()
  ViewletSearch.setResults(state, [
    {
      name: './result-1.txt',
    },
  ])
  const { $ListItems } = state
  expect($ListItems.children).toHaveLength(1)
})

test('setResults - multiple results in one file', () => {
  const state = ViewletSearch.create()
  ViewletSearch.setResults(state, [
    {
      name: './result-1.txt',
    },
  ])
  const { $ListItems } = state
  expect($ListItems.children).toHaveLength(1)
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
  const { $ListItems } = state
  expect($ListItems.children).toHaveLength(2)
})

test('accessibility - input box should have type search', () => {
  const state = ViewletSearch.create()
  const { $ViewletSearchInput } = state
  expect($ViewletSearchInput.type).toBe('search')
})

test('accessibility - input box should have enterkeyhint search', () => {
  const state = ViewletSearch.create()
  const { $ViewletSearchInput } = state
  expect($ViewletSearchInput.enterKeyHint).toBe('search')
})
