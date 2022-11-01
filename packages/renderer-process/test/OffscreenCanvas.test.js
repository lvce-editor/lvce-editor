/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeAll(() => {
  // @ts-ignore
  HTMLCanvasElement.prototype.transferControlToOffscreen = () => {
    return {
      isOffscreenCanvasPlaceholder: true,
    }
  }
})

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(),
      sendAndTransfer: jest.fn(),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const OffscreenCanvas = await import(
  '../src/parts/OffscreenCanvas/OffscreenCanvas.js'
)

test('create', () => {
  OffscreenCanvas.create()
  expect(RendererWorker.sendAndTransfer).toHaveBeenCalledTimes(1)
  expect(RendererWorker.sendAndTransfer).toHaveBeenCalledWith(
    {
      jsonrpc: '2.0',
      method: 'setOffscreenCanvas',
      params: [
        {
          isOffscreenCanvasPlaceholder: true,
        },
      ],
    },
    [{ isOffscreenCanvasPlaceholder: true }]
  )
})
