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

const ViewletSimpleBrowser = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js'
)

test('event - input', () => {
  const state = ViewletSimpleBrowser.create()
  const { $InputBox } = state
  $InputBox.value = 'abc'
  const event = new InputEvent('input', {
    bubbles: true,
    cancelable: true,
  })
  $InputBox.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'SimpleBrowser.handleInput',
    'abc'
  )
})
