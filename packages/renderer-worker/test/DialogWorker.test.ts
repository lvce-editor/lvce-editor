/* eslint-disable jest/no-restricted-jest-methods -- Dialog worker tests use ESM module mocks for worker dependencies. */
import { expect, jest, test } from '@jest/globals'

const worker = {
  invoke: jest.fn(),
  invokeAndTransfer: jest.fn(),
}

jest.unstable_mockModule('../src/parts/GetOrCreateWorker/GetOrCreateWorker.js', () => ({
  getOrCreateWorker: jest.fn(() => worker),
}))

jest.unstable_mockModule('../src/parts/LaunchDialogWorker/LaunchDialogWorker.js', () => ({
  launchDialogWorker: jest.fn(),
}))

const DialogWorker = await import('../src/parts/DialogWorker/DialogWorker.js')
const GetOrCreateWorker = await import('../src/parts/GetOrCreateWorker/GetOrCreateWorker.js')
const LaunchDialogWorker = await import('../src/parts/LaunchDialogWorker/LaunchDialogWorker.js')

test('configures a dialog worker', () => {
  expect(GetOrCreateWorker.getOrCreateWorker).toHaveBeenCalledWith(LaunchDialogWorker.launchDialogWorker)
  expect(DialogWorker.invoke).toBe(worker.invoke)
  expect(DialogWorker.invokeAndTransfer).toBe(worker.invokeAndTransfer)
})
