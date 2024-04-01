/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => {
  return {
    send: jest.fn(),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.ts')

const ViewletVideo = await import('../src/parts/ViewletVideo/ViewletVideo.ts')

test.skip('event - error', () => {
  const state = ViewletVideo.create()
  ViewletVideo.attachEvents(state)
  // @ts-ignore
  const { $Video } = state
  // @ts-ignore
  $Video.error = {
    code: 4,
    message: 'MEDIA_ELEMENT_ERROR: Media load rejected by URL safety check',
  }
  const event = new Event('error')
  $Video.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Video.handleVideoError', 4, 'MEDIA_ELEMENT_ERROR: Media load rejected by URL safety check')
})
