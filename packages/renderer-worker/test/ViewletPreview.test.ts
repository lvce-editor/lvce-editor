/* eslint-disable jest/no-restricted-jest-methods -- Preview disposal tests use ESM module mocks for worker dependencies. */
import { expect, jest, test } from '@jest/globals'

const disposePreviewSandBoxWorker = jest.fn<() => Promise<void>>()

jest.unstable_mockModule('../src/parts/CreateWorkerViewlet/CreateWorkerViewlet.js', () => ({
  createWorkerViewlet: jest.fn(() => ({})),
}))

jest.unstable_mockModule('../src/parts/GetOrCreateWorker/GetOrCreateWorker.js', () => ({
  getOrCreateWorker: jest.fn(() => ({
    dispose: disposePreviewSandBoxWorker,
  })),
}))

const ViewletPreview = await import('../src/parts/ViewletPreview/ViewletPreview.js')

test('dispose closes the preview sandbox worker', async () => {
  await ViewletPreview.dispose()

  expect(disposePreviewSandBoxWorker).toHaveBeenCalledTimes(1)
})
