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

const ViewletEditorFindWidget = await import(
  '../src/parts/ViewletEditorFindWidget/ViewletEditorFindWidget.js'
)

test('event - input', () => {
  const state = ViewletEditorFindWidget.create()
  const { $InputBox } = state
  $InputBox.value = 'abc'
  const event = new InputEvent('input')
  $InputBox.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'EditorFindWidget.handleInput',
    'abc'
  )
})

test('event - click on focusPrevious', () => {
  const state = ViewletEditorFindWidget.create()
  const { $ButtonFocusPrevious } = state
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  $ButtonFocusPrevious.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'EditorFindWidget.focusPrevious'
  )
})

test('event - click on focusNext', () => {
  const state = ViewletEditorFindWidget.create()
  const { $ButtonFocusNext } = state
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  $ButtonFocusNext.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('EditorFindWidget.focusNext')
})

test('event - click on close', () => {
  const state = ViewletEditorFindWidget.create()
  const { $ButtonClose } = state
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  $ButtonClose.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Viewlet.closeWidget',
    'EditorFindWidget'
  )
})
