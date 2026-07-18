import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn()

jest.unstable_mockModule('../src/parts/ProcessExplorerWorker/ProcessExplorerWorker.js', () => ({
  invoke,
}))

const ViewletProcessExplorer = await import('../src/parts/ViewletProcessExplorer/ViewletProcessExplorer.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('dispose - disposes process explorer worker state', async () => {
  const state = {
    uid: 7,
  }

  await ViewletProcessExplorer.dispose(state)

  expect(invoke).toHaveBeenCalledWith('ProcessExplorer.dispose', 7)
})
