import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const ViewletMainHandleDragLeave = await import('../src/parts/ViewletMain/ViewletMainHandleDragLeave.js')

test('handleDragLeave', async () => {
  const state = {
    uid: 1,
  }
  await ViewletMainHandleDragLeave.handleDragLeave(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [
    ['Viewlet.send', 1, 'stopHighlightDragOver'],
    ['Viewlet.send', 1, 'hideDragOverlay'],
  ])
})
