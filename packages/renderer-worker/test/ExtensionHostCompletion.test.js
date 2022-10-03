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
const ExtensionHostCompletion = await import(
  '../src/parts/ExtensionHost/ExtensionHostCompletion.js'
)

test('executeCompletionProvider - no results', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    return []
  })
  const editor = { id: 1, uri: '' }

  expect(
    await ExtensionHostCompletion.executeCompletionProvider(editor, 0)
  ).toEqual([])
  expect(ExtensionHostEditor.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostEditor.execute).toHaveBeenCalledWith({
    args: [0],
    combineResults: expect.any(Function),
    editor,
    event: ExtensionHostActivationEvent.OnCompletion,
    method: 'ExtensionHostCompletion.execute',
    noProviderFoundMessage: 'no completion provider found',
    noProviderFoundResult: [],
  })
})

test('executeCompletionProvider - error', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  const promise = ExtensionHostCompletion.executeCompletionProvider(
    { id: 1, uri: '' },
    0
  )
  await expect(promise).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})
