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

const ExtensionHostTabCompletion = await import(
  '../src/parts/ExtensionHost/ExtensionHostTabCompletion.js'
)

test('executeTabCompletionProvider - no tab completion', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(() => {
    return undefined
  })
  const editor = { id: 1, languageId: 'test' }

  expect(
    await ExtensionHostTabCompletion.executeTabCompletionProvider(editor, 0)
  ).toBe(undefined)
  expect(ExtensionHostEditor.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostEditor.execute).toHaveBeenCalledWith({
    editor,
    combineResults: expect.any(Function),
    event: ExtensionHostActivationEvent.OnTabCompletion,
    method: 'ExtensionHost.executeTabCompletionProvider',
    noProviderFoundMessage: 'No tab completion provider found',
    args: [0],
  })
})

test('executeTabCompletionProvider - tab completion', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(() => {
    return {}
  })
  expect(
    await ExtensionHostTabCompletion.executeTabCompletionProvider(
      { id: 1, languageId: 'test' },
      0
    )
  ).toEqual({})
})

test('executeTabCompletionProvider - error - tabCompletionProvider throws error', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostTabCompletion.executeTabCompletionProvider(
      { id: 1, languageId: 'test' },
      0
    )
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
