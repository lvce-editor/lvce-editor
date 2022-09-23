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
    'ViewletEditorFindWidget.handleInput',
    'abc'
  )
})
