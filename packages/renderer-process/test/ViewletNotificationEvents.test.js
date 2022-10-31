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

const ViewletNotification = await import(
  '../src/parts/ViewletNotification/ViewletNotification.js'
)

test.skip('event - click', () => {
  const state = ViewletNotification.create()
  const { $Viewlet } = state
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  $Viewlet.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith({})
})
