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
const ViewletMainHandleDrop = await import('../src/parts/ViewletMain/ViewletMainHandleDrop.js')

test('handleDragDrop', async () => {
  const state = {
    uid: 1,
  }
  await ViewletMainHandleDrop.handleDragLeave(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [
    ['Viewlet.send', 1, 'stopHighlightDragOver'],
    ['Viewlet.send', 1, 'hideDragOverlay'],
  ])
})
