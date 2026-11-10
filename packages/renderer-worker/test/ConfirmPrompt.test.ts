/* eslint-disable jest/no-restricted-jest-methods -- Prompt tests use ESM module mocks for worker dependencies. */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

jest.unstable_mockModule('../src/parts/DialogWorker/DialogWorker.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ElectronDialog/ElectronDialog.js', () => ({
  showMessageBox: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(() => PlatformType.Test),
}))

const ConfirmPrompt = await import('../src/parts/ConfirmPrompt/ConfirmPrompt.js')
const DialogWorker = await import('../src/parts/DialogWorker/DialogWorker.js')
const ElectronDialog = await import('../src/parts/ElectronDialog/ElectronDialog.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
const TestWorker = await import('../src/parts/TestWorker/TestWorker.js')
const Platform = await import('../src/parts/Platform/Platform.js')

beforeEach(() => {
  jest.resetAllMocks()
  ConfirmPrompt.mock(0)
  // @ts-ignore
  Platform.getPlatform.mockReturnValue(PlatformType.Test)
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

test.each([
  { expected: 'save', response: 0 },
  { expected: 'cancel', response: 1 },
  { expected: 'discard', response: 2 },
  { expected: 'cancel', response: undefined },
])(
  'prompt3 - native $expected needs no dialog worker after package replacement',
  async ({ expected, response }: Readonly<{ expected: string; response: number | undefined }>) => {
    // @ts-ignore
    ElectronDialog.showMessageBox.mockResolvedValue(response)

    await expect(ConfirmPrompt.prompt3('Save changes?', { platform: PlatformType.Electron, title: 'Save Changes' })).resolves.toBe(expected)

    expect(ElectronDialog.showMessageBox).toHaveBeenCalledWith({
      buttons: ['Save', 'Cancel', "Don't Save"],
      defaultId: 0,
      message: 'Save changes?',
      title: 'Save Changes',
      type: 'question',
    })
    expect(DialogWorker.invoke).not.toHaveBeenCalled()
  },
)

test('prompt3 - native confirmation preserves custom button labels', async () => {
  // @ts-ignore
  ElectronDialog.showMessageBox.mockResolvedValue(2)
  await expect(
    ConfirmPrompt.prompt3('Save?', {
      cancelMessage: 'Wait',
      confirmMessage: 'Keep',
      discardMessage: 'Discard',
      platform: PlatformType.Electron,
    }),
  ).resolves.toBe('discard')
  expect(ElectronDialog.showMessageBox).toHaveBeenCalledWith({
    buttons: ['Keep', 'Wait', 'Discard'],
    defaultId: 0,
    message: 'Save?',
    title: '',
    type: 'question',
  })
})

test('prompt3 - runtime Electron confirmation waits for the user when worker assets are unavailable', async () => {
  const decision = Promise.withResolvers<number>()
  // @ts-ignore
  Platform.getPlatform.mockReturnValue(PlatformType.Electron)
  // @ts-ignore
  DialogWorker.invoke.mockRejectedValue(new Error('Old dialog worker removed by package update'))
  // @ts-ignore
  ElectronDialog.showMessageBox.mockReturnValue(decision.promise)
  const resolved = jest.fn()
  const prompt = (async (): Promise<void> => {
    const result = await ConfirmPrompt.prompt3('Save changes?')
    resolved(result)
  })()
  await Promise.resolve()
  expect(resolved).not.toHaveBeenCalled()
  expect(DialogWorker.invoke).not.toHaveBeenCalled()
  decision.resolve(1)
  await prompt
  expect(resolved).toHaveBeenCalledWith('cancel')
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
])('prompt3 - preserves confirm mocks for $expected', async ({ answers, expected }: Readonly<{ answers: readonly boolean[]; expected: string }>) => {
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
  expect(JsonRpc.invoke).toHaveBeenLastCalledWith(
    ipc,
    'Test.executeMock',
    42,
    answers.length === 2 ? 'Discard this file?' : 'Save this file?',
    options,
  )
  expect(DialogWorker.invoke).not.toHaveBeenCalled()
})
