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

test('prompt3 - invokes dialog worker', async () => {
  const options = {
    cancelMessage: 'Cancel',
    confirmMessage: 'Save',
    discardMessage: "Don't Save",
    discardPrompt: 'Discard changes?',
    title: 'Save Changes',
  }
  // @ts-ignore
  DialogWorker.invoke.mockResolvedValue('discard')

  await expect(ConfirmPrompt.prompt3('Save changes?', options)).resolves.toBe('discard')

  expect(DialogWorker.invoke).toHaveBeenCalledWith('ConfirmPrompt.prompt3', 'Save changes?', options)
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

test('showErrorMessage - preserves test worker mocks', async () => {
  const ipc = {}
  TestWorker.set(ipc)
  ConfirmPrompt.mock(42)
  // @ts-ignore
  JsonRpc.invoke.mockResolvedValue(true)

  await expect(
    ConfirmPrompt.showErrorMessage({
      confirmMessage: 'Close',
      message: 'Something went wrong',
      platform: PlatformType.Electron,
      title: 'Error',
    }),
  ).resolves.toBe(true)

  expect(JsonRpc.invoke).toHaveBeenCalledWith(ipc, 'Test.executeMock', 42, 'Something went wrong', {
    confirmMessage: 'Close',
    title: 'Error',
  })
  expect(DialogWorker.invoke).not.toHaveBeenCalled()
})

// Match the two boolean decisions made by the browser three-way prompt.
test.each([
  { answers: [true], expected: 'save' },
  { answers: [false, true], expected: 'discard' },
  { answers: [false, false], expected: 'cancel' },
])('prompt3 - preserves confirm mocks for $expected', async ({ answers, expected }) => {
  const ipc = {}
  TestWorker.set(ipc)
  ConfirmPrompt.mock(42)
  for (const answer of answers) {
    // @ts-ignore
    JsonRpc.invoke.mockResolvedValueOnce(answer)
  }
  const options = { discardPrompt: 'Discard this file?', title: 'Save Changes' }

  await expect(ConfirmPrompt.prompt3('Save this file?', options)).resolves.toBe(expected)

  expect(JsonRpc.invoke).toHaveBeenNthCalledWith(1, ipc, 'Test.executeMock', 42, 'Save this file?', options)
  expect(JsonRpc.invoke).toHaveBeenCalledTimes(answers.length)
  if (answers.length === 2) {
    expect(JsonRpc.invoke).toHaveBeenNthCalledWith(2, ipc, 'Test.executeMock', 42, 'Discard this file?', options)
  }
  expect(DialogWorker.invoke).not.toHaveBeenCalled()
})
