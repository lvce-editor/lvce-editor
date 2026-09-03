/* eslint-disable jest/no-restricted-jest-methods -- Prompt tests use ESM module mocks for worker dependencies. */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

jest.unstable_mockModule('../src/parts/DialogWorker/DialogWorker.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invoke: jest.fn(),
}))

const ConfirmPrompt = await import('../src/parts/ConfirmPrompt/ConfirmPrompt.js')
const DialogWorker = await import('../src/parts/DialogWorker/DialogWorker.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
const TestWorker = await import('../src/parts/TestWorker/TestWorker.js')

beforeEach(() => {
  jest.resetAllMocks()
  ConfirmPrompt.mock(0)
})

test('prompt - invokes dialog worker', async () => {
  // @ts-ignore
  DialogWorker.invoke.mockResolvedValue(true)

  await expect(ConfirmPrompt.prompt('Continue?', { platform: PlatformType.Web })).resolves.toBe(true)

  expect(DialogWorker.invoke).toHaveBeenCalledWith('ConfirmPrompt.prompt', 'Continue?', {
    cancelMessage: 'Cancel',
    confirmMessage: 'Ok',
    platform: PlatformType.Web,
    title: '',
  })
})

test('showErrorMessage - invokes dialog worker', async () => {
  // @ts-ignore
  DialogWorker.invoke.mockResolvedValue(true)

  await expect(
    ConfirmPrompt.showErrorMessage({
      confirmMessage: 'Close',
      message: 'Something went wrong',
      platform: PlatformType.Electron,
      title: 'Error',
    }),
  ).resolves.toBe(true)

  expect(DialogWorker.invoke).toHaveBeenCalledWith('ConfirmPrompt.showErrorMessage', {
    confirmMessage: 'Close',
    message: 'Something went wrong',
    platform: PlatformType.Electron,
    title: 'Error',
  })
})

test('prompt - preserves test worker mocks', async () => {
  const ipc = {}
  TestWorker.set(ipc)
  ConfirmPrompt.mock(42)
  // @ts-ignore
  JsonRpc.invoke.mockResolvedValue(false)

  await expect(ConfirmPrompt.prompt('Continue?', { platform: PlatformType.Web })).resolves.toBe(false)

  expect(JsonRpc.invoke).toHaveBeenCalledWith(ipc, 'Test.executeMock', 42, 'Continue?', {
    cancelMessage: 'Cancel',
    confirmMessage: 'Ok',
    title: '',
  })
  expect(DialogWorker.invoke).not.toHaveBeenCalled()
})
