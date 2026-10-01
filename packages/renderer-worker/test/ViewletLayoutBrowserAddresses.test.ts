import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke: jest.fn() }))
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({ getInstance: jest.fn() }))
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')
const Layout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

test('layout reconciliation restores each browser address independently', async () => {
  const oldState = Layout.create(1)
  const newState = {
    ...oldState,
    previewId: 2,
    secondaryPreviewId: 3,
    secondaryPreviewPlacement: 'bottomLeft' as const,
    secondaryPreviewVisible: true,
  }
  jest.mocked(ViewletStates.getInstance).mockImplementation((uid) => ({
    moduleId: 'SimpleBrowser',
    state: { inputValue: uid === 2 ? 'http://localhost/video' : 'http://localhost/project' },
  }))
  await Layout.afterRender(oldState, newState)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [
    ['Viewlet.setValueByName', 2, 'simple-browser-address', 'http://localhost/video'],
    ['Viewlet.setValueByName', 3, 'simple-browser-address', 'http://localhost/project'],
  ])
})
