/* eslint-disable jest/no-restricted-jest-methods -- Preview disposal tests use ESM module mocks for worker dependencies. */
import { expect, jest, test } from '@jest/globals'
import * as RuntimeConfig from '../src/parts/RuntimeConfig/RuntimeConfig.ts'

const disposePreviewSandBoxWorker = jest.fn<() => Promise<void>>()
const disposePreviewWorker = jest.fn<(_state: unknown) => Promise<void>>()
const invokePreviewWorker = jest.fn<(...args: readonly unknown[]) => Promise<void>>()
const requestRender = jest.fn<(uid: number) => Promise<void>>()
const invokeOutputViewWorker = jest.fn<(...args: readonly unknown[]) => Promise<void>>()

jest.unstable_mockModule('../src/parts/CreateWorkerViewlet/CreateWorkerViewlet.js', () => ({
  createWorkerViewlet: jest.fn(() => ({
    dispose: disposePreviewWorker,
    getCommands: async () => ({}),
    loadContent: jest.fn(async (state) => state),
  })),
}))

jest.unstable_mockModule('../src/parts/GetOrCreateWorker/GetOrCreateWorker.js', () => ({
  getOrCreateWorker: jest.fn(() => ({
    dispose: disposePreviewSandBoxWorker,
  })),
}))

jest.unstable_mockModule('../src/parts/OutputViewWorker/OutputViewWorker.js', () => ({
  invoke: invokeOutputViewWorker,
}))

jest.unstable_mockModule('../src/parts/PreviewWorker/PreviewWorker.js', () => ({ invoke: invokePreviewWorker }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ requestRender }))

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

test('preview lifecycle shows and hides the preview sandbox output channel', async () => {
  invokeOutputViewWorker.mockClear()
  await ViewletPreview.loadContent({ uid: 20 })
  await ViewletPreview.loadContent({ uid: 21 })
  expect(invokeOutputViewWorker).toHaveBeenCalledTimes(1)
  expect(invokeOutputViewWorker).toHaveBeenLastCalledWith('Output.setPreviewSandboxActive', true)

  await ViewletPreview.dispose({ uid: 20 })
  expect(invokeOutputViewWorker).toHaveBeenCalledTimes(1)

  await ViewletPreview.dispose({ uid: 21 })
  expect(invokeOutputViewWorker).toHaveBeenCalledTimes(2)
  expect(invokeOutputViewWorker).toHaveBeenLastCalledWith('Output.setPreviewSandboxActive', false)
})

test('embedded preview can run without creating an output channel', async () => {
  RuntimeConfig.initialize({ previewOutputEnabled: false })
  invokeOutputViewWorker.mockClear()
  try {
    await ViewletPreview.loadContent({ uid: 30 })
    await ViewletPreview.dispose({ uid: 30 })
    expect(invokeOutputViewWorker).not.toHaveBeenCalled()
  } finally {
    RuntimeConfig.initialize()
  }
})

test('worker render notifications refresh every preview, including unselected tabs', async () => {
  invokePreviewWorker.mockClear()
  requestRender.mockClear()
  await ViewletPreview.loadContent({ uid: 40 })
  await ViewletPreview.loadContent({ uid: 41 })
  try {
    const commands = await ViewletPreview.getCommands()
    expect(commands.rerender.requiresInstance).toBe(false)
    await commands.rerender()
    expect(invokePreviewWorker.mock.calls).toEqual([
      ['Preview.rerender', 40],
      ['Preview.rerender', 41],
    ])
    expect(requestRender.mock.calls).toEqual([[40], [41]])
    await ViewletPreview.dispose({ uid: 40 })
    invokePreviewWorker.mockClear()
    requestRender.mockClear()
    await commands.rerender()
    expect(invokePreviewWorker.mock.calls).toEqual([['Preview.rerender', 41]])
    expect(requestRender.mock.calls).toEqual([[41]])
  } finally {
    await ViewletPreview.dispose({ uid: 41 })
  }
})
