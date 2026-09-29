import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: unknown[]) => Promise<unknown>>()
jest.unstable_mockModule('../src/parts/UpdateWorker/UpdateWorker.js', () => ({ invoke }))

const { getLatestVersion } = await import('../src/parts/GetLatestVersion/GetLatestVersion.js')

test('delegates update detection to the worker that reads the emulated version setting', async () => {
  invoke.mockResolvedValue({ version: '0.115.15' })

  await expect(getLatestVersion()).resolves.toEqual({ version: '0.115.15' })
  expect(invoke).toHaveBeenCalledWith('Update.getLatestVersion', 'lvce-editor/lvce-editor')
})
