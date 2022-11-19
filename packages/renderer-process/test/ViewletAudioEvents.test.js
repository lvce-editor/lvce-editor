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

const ViewletAudio = await import('../src/parts/ViewletAudio/ViewletAudio.js')

test('event - error', () => {
  const state = ViewletAudio.create()
  const { $Audio } = state
  // @ts-ignore
  $Audio.error = {
    code: 4,
    message: 'MEDIA_ELEMENT_ERROR: Media load rejected by URL safety check',
  }
  const event = new Event('error')
  $Audio.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Audio.handleAudioError',
    4,
    'MEDIA_ELEMENT_ERROR: Media load rejected by URL safety check'
  )
})
