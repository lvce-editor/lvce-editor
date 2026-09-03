import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/EmbedsWorker/EmbedsWorker.js', () => ({
  dispose: jest.fn(),
  invoke: jest.fn(() => 12),
}))

const ElectronWebContentsView = await import('../src/parts/ElectronWebContentsView/ElectronWebContentsView.js')
const EmbedsWorker = await import('../src/parts/EmbedsWorker/EmbedsWorker.js')

test('tracks an adopted popup until both browser views are closed', async () => {
  await expect(ElectronWebContentsView.createWebContentsView(0, [])).resolves.toBe(12)
  ElectronWebContentsView.adoptWebContentsView()

  await ElectronWebContentsView.releaseWebContentsView()

  expect(EmbedsWorker.dispose).not.toHaveBeenCalled()

  await ElectronWebContentsView.disposeWebContentsView(12)

  expect(EmbedsWorker.invoke).toHaveBeenLastCalledWith('ElectronWebContentsView.disposeWebContentsView', 12)
  expect(EmbedsWorker.dispose).toHaveBeenCalledTimes(1)
})
