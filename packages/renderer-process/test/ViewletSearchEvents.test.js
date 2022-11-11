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
  const { $ListItems } = state
  const event = new Event('mousedown', {
    bubbles: true,
    cancelable: true,
  })
  $ListItems.children[0].dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Search.handleClick', 0)
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
  const { $ListItems } = state
  $ListItems.dispatchEvent(event)
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
  const { $ListItems } = state
  $ListItems.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Search.handleContextMenuMouseAt',
    50,
    50
  )
})
