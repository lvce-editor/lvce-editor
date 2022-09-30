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
      send: jest.fn(),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletTitleBarButtons = await import(
  '../src/parts/ViewletTitleBarButtons/ViewletTitleBarButtons.js'
)

test('event - click - minimize', () => {
  const state = ViewletTitleBarButtons.create()
  const { $TitleBarButtons } = state
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
  })
  $TitleBarButtons.children[0].dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'TitleBarButtons.handleClickMinimize'
  )
})

test('event - click - toggleMaximize', () => {
  const state = ViewletTitleBarButtons.create()
  const { $TitleBarButtons } = state
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
  })
  $TitleBarButtons.children[1].dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'TitleBarButtons.handleClickToggleMaximize'
  )
})

test('event - click - close', () => {
  const state = ViewletTitleBarButtons.create()
  const { $TitleBarButtons } = state
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
  })
  $TitleBarButtons.children[2].dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'TitleBarButtons.handleClickClose'
  )
})
