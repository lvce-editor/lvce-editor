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
      send: jest.fn(() => {}),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletFindWidget = await import(
  '../src/parts/ViewletFindWidget/ViewletFindWidget.js'
)

test('event - input', () => {
  const state = ViewletFindWidget.create()
  const { $InputBox } = state
  $InputBox.value = 'abc'
  const event = new InputEvent('input')
  $InputBox.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'FindWidget.handleInput',
    'abc'
  )
})

test('event - click on focusPrevious', () => {
  const state = ViewletFindWidget.create()
  const { $ButtonFocusPrevious } = state
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  $ButtonFocusPrevious.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('FindWidget.focusPrevious')
})

test('event - click on focusNext', () => {
  const state = ViewletFindWidget.create()
  const { $ButtonFocusNext } = state
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  $ButtonFocusNext.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('FindWidget.focusNext')
})

test('event - click on close', () => {
  const state = ViewletFindWidget.create()
  const { $ButtonClose } = state
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  $ButtonClose.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Viewlet.closeWidget',
    'FindWidget'
  )
})
