import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/EmbedsWorker/EmbedsWorker.js', () => ({
  invoke: jest.fn(),
}))

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

test('insertJavaScript forwards to the embeds worker without a user gesture', async () => {
  // @ts-ignore
  EmbedsWorker.invoke.mockResolvedValue({ value: 1 })

  await expect(ElectronWebContentsViewFunctions.insertJavaScript(12, 'document.title')).resolves.toEqual({ value: 1 })
  expect(EmbedsWorker.invoke).toHaveBeenCalledWith('ElectronWebContentsView.insertJavaScript', 12, 'document.title', false)
})
