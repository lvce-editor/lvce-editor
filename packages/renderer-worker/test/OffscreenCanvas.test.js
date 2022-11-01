import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

const OffscreenCanvas = await import(
  '../src/parts/OffscreenCanvas/OffscreenCanvas.js'
)

test('create', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return {
      isOffscreenCanvasPlaceholder: true,
    }
  })
  const offscreenCanvas = await OffscreenCanvas.create()
  expect(offscreenCanvas).toEqual({
    isOffscreenCanvasPlaceholder: true,
  })
})
