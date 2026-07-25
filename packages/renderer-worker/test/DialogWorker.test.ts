/* eslint-disable jest/no-restricted-jest-methods -- Dialog worker tests use ESM module mocks for RPC dependencies. */
import { expect, jest, test } from '@jest/globals'

const lazyRpc = {
  invoke: jest.fn(),
  invokeAndTransfer: jest.fn(),
  setFactory: jest.fn(),
}

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  createLazyRpc: jest.fn(() => lazyRpc),
  RpcId: {
    DialogWorker: 7014,
  },
}))

jest.unstable_mockModule('../src/parts/LaunchDialogWorker/LaunchDialogWorker.js', () => ({
  launchDialogWorker: jest.fn(),
}))

const RpcRegistry = await import('@lvce-editor/rpc-registry')
const DialogWorker = await import('../src/parts/DialogWorker/DialogWorker.js')
const LaunchDialogWorker = await import('../src/parts/LaunchDialogWorker/LaunchDialogWorker.js')

test('configures a lazy dialog worker rpc', () => {
  expect(RpcRegistry.createLazyRpc).toHaveBeenCalledWith(RpcRegistry.RpcId.DialogWorker)
  expect(lazyRpc.setFactory).toHaveBeenCalledWith(LaunchDialogWorker.launchDialogWorker)
  expect(DialogWorker.invoke).toBe(lazyRpc.invoke)
  expect(DialogWorker.invokeAndTransfer).toBe(lazyRpc.invokeAndTransfer)
})
