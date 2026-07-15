import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: jest.fn(),
}))

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const ToggleFullScreen = await import('../src/parts/ToggleFullScreen/ToggleFullScreen.js')

test('toggleFullScreen - web', async () => {
  await ToggleFullScreen.toggleFullScreen()

  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Window.toggleFullScreen')
})
