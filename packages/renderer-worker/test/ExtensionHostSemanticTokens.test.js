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
const ExtensionHostSemanticTokens = await import(
  '../src/parts/ExtensionHost/ExtensionHostSemanticTokens.js'
)

test('executeSemanticTokenProvider', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    return []
  })
  const editor = {
    id: 1,
    languageId: 'test',
  }
  expect(
    await ExtensionHostSemanticTokens.executeSemanticTokenProvider(editor)
  ).toEqual([])
  expect(ExtensionHostEditor.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostEditor.execute).toHaveBeenCalledWith({
    editor,
    combineResults: expect.any(Function),
    event: ExtensionHostActivationEvent.OnSemanticTokens,
    method: 'ExtensionHostSemanticTokens.executeSemanticTokenProvider',
    noProviderFoundMessage: 'No Semantic Token Provider found',
    noProviderFoundResult: [],
    args: [],
  })
})

test('executeSemanticTokenProvider - error', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostSemanticTokens.executeSemanticTokenProvider({
      id: 1,
      languageId: 'test',
    })
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
