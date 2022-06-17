/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ViewletSearch from '../src/parts/Viewlet/ViewletSearch.js'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.js'

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

test('event - input', () => {
  const state = ViewletSearch.create()
  RendererWorker.state.send = jest.fn()
  state.$ViewletSearchInput.value = 'test search'
  state.$ViewletSearchInput.dispatchEvent(
    new Event('input', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledWith([9444, 'test search'])
})

test('setResults - no results', () => {
  const state = ViewletSearch.create()
  ViewletSearch.setResults(state, [], 0, 0)
  const $Status = state.$SearchStatus
  expect($Status.textContent).toBe('No results found')
})

test('setResults - one result in one file', () => {
  const state = ViewletSearch.create()
  ViewletSearch.setResults(
    state,
    [
      {
        name: './result-1.txt',
      },
    ],
    1,
    1
  )
  const $Status = state.$SearchStatus
  expect($Status.textContent).toBe('Found 1 result in 1 file')
})

test('setResults - multiple results in one file', () => {
  const state = ViewletSearch.create()
  ViewletSearch.setResults(
    state,
    [
      {
        name: './result-1.txt',
      },
    ],
    2,
    1
  )
  const $Status = state.$SearchStatus
  expect($Status.textContent).toBe('Found 2 results in 1 file')
})

test('setResults - multiple results in multiple files', () => {
  const state = ViewletSearch.create()
  ViewletSearch.setResults(
    state,
    [
      {
        name: './result-1.txt',
      },
      {
        name: './result-2.txt',
      },
    ],
    2,
    2
  )
  const $Status = state.$SearchStatus
  expect($Status.textContent).toBe('Found 2 results in 2 files')
})
