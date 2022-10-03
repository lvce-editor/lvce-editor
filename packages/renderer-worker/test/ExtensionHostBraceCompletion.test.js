import { jest } from '@jest/globals'
import * as ExtensionHostActivationEvent from '../src/parts/ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostEditor.js',
  () => {
    return {
      execute: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
const ExtensionHostEditor = await import(
  '../src/parts/ExtensionHost/ExtensionHostEditor.js'
)

const ExtensionHostBraceCompletion = await import(
  '../src/parts/ExtensionHost/ExtensionHostBraceCompletion.js'
)

test('executeBraceCompletionProvider - no brace completion', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(() => {
    return false
  })
  expect(
    await ExtensionHostBraceCompletion.executeBraceCompletionProvider(
      { id: 1, uri: '', languageId: 'xyz' },
      0,
      '{'
    )
  ).toBe(false)
})

test('executeBraceCompletionProvider - brace completion', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(() => {
    return true
  })
  const editor = { id: 1, uri: '', languageId: 'xyz' }
  expect(
    await ExtensionHostBraceCompletion.executeBraceCompletionProvider(
      editor,
      0,
      '{'
    )
  ).toBe(true)
  expect(ExtensionHostEditor.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostEditor.execute).toHaveBeenCalledWith({
    editor,
    combineResults: expect.any(Function),
    event: ExtensionHostActivationEvent.OnBraceCompletion,
    method: 'ExtensionHostBraceCompletion.executeBraceCompletionProvider',
    noProviderFoundMessage: 'no brace completion providers found',
    noProviderFoundResult: undefined,
    args: [0, '{'],
  })
})

test('executeBraceCompletionProvider - error - BraceCompletionProvider throws error', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    throw new Error(
      'Failed to execute BraceCompletion provider: TypeError: x is not a function'
    )
  })
  await expect(
    ExtensionHostBraceCompletion.executeBraceCompletionProvider(
      { id: 1, uri: '', languageId: 'xyz' },
      0,
      '{'
    )
  ).rejects.toThrowError(
    new Error(
      'Failed to execute BraceCompletion provider: TypeError: x is not a function'
    )
  )
})

test('executeBraceCompletionProvider - missing argument openingBrace', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(() => {
    return true
  })
  expect(() =>
    ExtensionHostBraceCompletion.executeBraceCompletionProvider(
      { id: 1, uri: '', languageId: 'xyz' },
      0
    )
  ).toThrowError(new Error('expected value to be of type string'))
})
