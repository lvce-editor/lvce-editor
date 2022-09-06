/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as MouseEventType from '../src/parts/MouseEventType/MouseEventType.js'

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
    'Search.handleInput',
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
  expect(RendererWorker.send).toHaveBeenCalledWith('Search.handleClick', 0)
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

test('event - contextmenu - activated via keyboard', () => {
  const state = ViewletSearch.create()
  ViewletSearch.setResults(state, [
    {
      name: './result-1.txt',
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const event = new MouseEvent('contextmenu', {
    clientX: 50,
    clientY: 50,
    bubbles: true,
    button: -1,
    cancelable: true,
  })
  state.$SearchResults.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Search.handleContextMenuKeyboard'
  )
})

test('event - contextmenu - activated via mouse', () => {
  const state = ViewletSearch.create()
  ViewletSearch.setResults(state, [
    {
      name: './result-1.txt',
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const event = new MouseEvent('contextmenu', {
    clientX: 50,
    clientY: 50,
    bubbles: true,
    button: MouseEventType.LeftClick,
    cancelable: true,
  })
  state.$SearchResults.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Search.handleContextMenuMouseAt',
    50,
    50
  )
})
