import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke: jest.fn() }))
jest.unstable_mockModule('../src/parts/PreviewWorker/PreviewWorker.js', () => ({ invokeAndTransfer: jest.fn() }))
jest.unstable_mockModule('../src/parts/Id/Id.js', () => ({ create: jest.fn() }))

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const PreviewWorker = await import('../src/parts/PreviewWorker/PreviewWorker.js')
const Id = await import('../src/parts/Id/Id.js')
const Transferrable = await import('../src/parts/Transferrable/Transferrable.js')
const OffscreenCanvas = await import('../src/parts/OffscreenCanvas/OffscreenCanvas.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test.each([false, true])('forwards the canvas and optional presentation port (%s)', async (manual) => {
  jest.mocked(Id.create).mockReturnValueOnce(1).mockReturnValueOnce(2).mockReturnValueOnce(3)
  const canvas = { canvas: true }
  const port = { port: true }
  jest.mocked(RendererProcess.invoke).mockImplementation(async () => {
    Transferrable.transfer(2, canvas)
    if (manual) Transferrable.transfer(3, port)
    return manual
  })
  await OffscreenCanvas.createForPreview(99, 640, 480)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('OffscreenCanvas.createForPreview', 1, 2, 3, 640, 480)
  expect(PreviewWorker.invokeAndTransfer).toHaveBeenCalledWith('Preview.executeCallback', 99, canvas, 1, manual ? port : undefined)
})
