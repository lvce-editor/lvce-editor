import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/EmbedsWorker/EmbedsWorker.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/GetWindowZoomLevel/GetWindowZoomLevel.js', () => ({ getWindowZoomLevel: async () => 1 }))

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({ invoke: jest.fn() }))
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')

const EmbedsWorker = await import('../src/parts/EmbedsWorker/EmbedsWorker.js')
const ElectronWebContentsViewFunctions = await import('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js')

test('capturePage forwards to the embeds worker', async () => {
  const png = new Uint8Array([137, 80, 78, 71])
  // @ts-ignore
  EmbedsWorker.invoke.mockResolvedValue(png)

  await expect(ElectronWebContentsViewFunctions.capturePage(12)).resolves.toBe(png)
  expect(EmbedsWorker.invoke).toHaveBeenCalledWith('ElectronWebContentsView.capturePage', 12)
})

test('setAudioMuted forwards to the embeds worker', async () => {
  await ElectronWebContentsViewFunctions.setAudioMuted(12, true)

  expect(EmbedsWorker.invoke).toHaveBeenCalledWith('ElectronWebContentsView.setAudioMuted', 12, true)
})

test('getStats requests memory from the embeds worker when needed', async () => {
  await ElectronWebContentsViewFunctions.getStats(12, true)

  expect(EmbedsWorker.invoke).toHaveBeenCalledWith('ElectronWebContentsView.getStats', 12, true)
})

test('insertJavaScript forwards to the embeds worker without a user gesture', async () => {
  // @ts-ignore
  EmbedsWorker.invoke.mockResolvedValue({ value: 1 })

  await expect(ElectronWebContentsViewFunctions.insertJavaScript(12, 'document.title')).resolves.toEqual({ value: 1 })
  expect(EmbedsWorker.invoke).toHaveBeenCalledWith('ElectronWebContentsView.insertJavaScript', 12, 'document.title', false)
})

test('scales both native position and size at the window zoom level', async () => {
  await ElectronWebContentsViewFunctions.resizeWebContentsView(12, 100, 50, 300, 400)
  expect(EmbedsWorker.invoke).toHaveBeenCalledWith('ElectronWebContentsView.resizeWebContentsView', 12, 120, 60, 360, 480)
})

test('copyImageAt uses the native menu bridge with its originating tab and page coordinates', async () => {
  await ElectronWebContentsViewFunctions.copyImageAt(12, 20, 30)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronContextMenu.copyImage', 12, 20, 30)
})
