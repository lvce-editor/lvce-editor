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

const ViewletInputBox = await import('../src/parts/Viewlet/ViewletInputBox.js')

test('event - single click', () => {
  const state = ViewletInputBox.create()
  const { $InputBox } = state
  const event = new MouseEvent('mousedown')
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  // @ts-ignore
  document.caretRangeFromPoint = () => {
    return {
      startOffset: 3,
    }
  }
  $InputBox.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Input.handleSingleClick', 3)
})
