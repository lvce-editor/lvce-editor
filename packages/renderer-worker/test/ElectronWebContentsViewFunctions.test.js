import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/EmbedsWorker/EmbedsWorker.js', () => ({
  invoke: jest.fn(),
}))

const EmbedsWorker = await import('../src/parts/EmbedsWorker/EmbedsWorker.js')
const ElectronWebContentsViewFunctions = await import('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js')

test('capturePage forwards to the embeds worker', async () => {
  // @ts-ignore
  EmbedsWorker.invoke.mockResolvedValue('data:image/png;base64,c25hcHNob3Q=')

  await expect(ElectronWebContentsViewFunctions.capturePage(12)).resolves.toBe('data:image/png;base64,c25hcHNob3Q=')
  expect(EmbedsWorker.invoke).toHaveBeenCalledWith('ElectronWebContentsView.capturePage', 12)
})
