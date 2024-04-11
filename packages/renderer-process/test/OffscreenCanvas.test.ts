/**
 * @jest-environment jsdom
 */
import { beforeAll, beforeEach, expect, jest, test } from '@jest/globals'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.ts'

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

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => {
  return {
    send: jest.fn(),
    sendAndTransfer: jest.fn(),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.ts')

const OffscreenCanvas = await import('../src/parts/OffscreenCanvas/OffscreenCanvas.ts')

test('create', () => {
  // @ts-ignore
  OffscreenCanvas.create()
  expect(RendererWorker.sendAndTransfer).toHaveBeenCalledTimes(1)
  expect(RendererWorker.sendAndTransfer).toHaveBeenCalledWith(
    {
      jsonrpc: JsonRpcVersion.Two,
      params: [
        {
          isOffscreenCanvasPlaceholder: true,
        },
      ],
    },
    [{ isOffscreenCanvasPlaceholder: true }],
  )
})
