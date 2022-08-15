/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletSearch = await import(
  '../src/parts/ViewletSearch/ViewletSearch.js'
)

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
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const { $ViewletSearchInput } = state
  $ViewletSearchInput.value = 'test search'
  const event = new Event('input', {
    bubbles: true,
    cancelable: true,
  })
  $ViewletSearchInput.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'ViewletSearch.handleInput',
    'test search'
  )
})
test('event - click', () => {
  const state = ViewletSearch.create()
  ViewletSearch.setResults(state, [
    {
      name: './test.txt',
      path: '/test/test.txt',
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const { $SearchResults } = state
  const event = new Event('mousedown', {
    bubbles: true,
    cancelable: true,
  })
  $SearchResults.children[0].dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'ViewletSearch.handleClick',
    0
  )
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
