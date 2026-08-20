/* eslint-disable jest/no-restricted-jest-methods -- Preview disposal tests use ESM module mocks for worker dependencies. */
import { expect, jest, test } from '@jest/globals'

const disposePreviewSandBoxWorker = jest.fn<() => Promise<void>>()
const disposePreviewWorker = jest.fn<(_state: unknown) => Promise<void>>()

jest.unstable_mockModule('../src/parts/CreateWorkerViewlet/CreateWorkerViewlet.js', () => ({
  createWorkerViewlet: jest.fn(() => ({
    dispose: disposePreviewWorker,
  })),
}))

jest.unstable_mockModule('../src/parts/GetOrCreateWorker/GetOrCreateWorker.js', () => ({
  getOrCreateWorker: jest.fn(() => ({
    dispose: disposePreviewSandBoxWorker,
  })),
}))

const ViewletPreview = await import('../src/parts/ViewletPreview/ViewletPreview.js')

test('dispose clears preview state before closing the preview sandbox worker', async () => {
  const state = { uid: 7 }

  await ViewletPreview.dispose(state)

  expect(disposePreviewWorker).toHaveBeenCalledWith(state)
  expect(disposePreviewSandBoxWorker).toHaveBeenCalledTimes(1)
  expect(disposePreviewWorker.mock.invocationCallOrder[0]).toBeLessThan(disposePreviewSandBoxWorker.mock.invocationCallOrder[0])
})
