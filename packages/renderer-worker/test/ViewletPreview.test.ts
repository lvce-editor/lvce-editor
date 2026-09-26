/* eslint-disable jest/no-restricted-jest-methods -- Preview disposal tests use ESM module mocks for worker dependencies. */
import { expect, jest, test } from '@jest/globals'

const disposePreviewSandBoxWorker = jest.fn<() => Promise<void>>()
const disposePreviewWorker = jest.fn<(_state: unknown) => Promise<void>>()

jest.unstable_mockModule('../src/parts/CreateWorkerViewlet/CreateWorkerViewlet.js', () => ({
  createWorkerViewlet: jest.fn(() => ({
    dispose: disposePreviewWorker,
    loadContent: jest.fn(async (state) => state),
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

test('closing one of two previews preserves the shared sandbox', async () => {
  disposePreviewSandBoxWorker.mockClear()
  await ViewletPreview.loadContent({ uid: 10 })
  await ViewletPreview.loadContent({ uid: 11 })
  await ViewletPreview.dispose({ uid: 10 })
  expect(disposePreviewSandBoxWorker).not.toHaveBeenCalled()
  await ViewletPreview.dispose({ uid: 11 })
  expect(disposePreviewSandBoxWorker).toHaveBeenCalledTimes(1)
})
