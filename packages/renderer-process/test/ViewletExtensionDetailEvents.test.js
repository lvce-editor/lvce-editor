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

const ViewletExtensionDetail = await import(
  '../src/parts/ViewletExtensionDetail/ViewletExtensionDetail.js'
)
const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

test('event - image does not load', () => {
  const state = ViewletExtensionDetail.create()
  const { $ExtensionDetailIcon } = state
  const event = new ErrorEvent('error')
  $ExtensionDetailIcon.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'ExtensionDetail.handleIconError'
  )
})
