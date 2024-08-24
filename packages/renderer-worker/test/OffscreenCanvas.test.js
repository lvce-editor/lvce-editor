import { beforeEach, expect, jest, test } from '@jest/globals'
import * as Callback from '../src/parts/Callback/Callback.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const OffscreenCanvas = await import('../src/parts/OffscreenCanvas/OffscreenCanvas.js')

test.skip('create', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation((method, canvasId, id) => {
    Callback.resolve(id, {
      params: [
        {
          isOffscreenCanvasPlaceholder: true,
        },
      ],
    })
  })
  const offscreenCanvas = await OffscreenCanvas.create(1)
  expect(offscreenCanvas).toEqual({
    isOffscreenCanvasPlaceholder: true,
  })
})
