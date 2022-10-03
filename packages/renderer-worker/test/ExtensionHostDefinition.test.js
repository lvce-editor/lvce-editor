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
const ExtensionHostDefinition = await import(
  '../src/parts/ExtensionHost/ExtensionHostDefinition.js'
)

test('executeDefinitionProvider - no definition found', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    return []
  })
  const editor = { id: 1, uri: '' }

  expect(
    await ExtensionHostDefinition.executeDefinitionProvider(editor, 0)
  ).toEqual([])
  expect(ExtensionHostEditor.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostEditor.execute).toHaveBeenCalledWith({
    args: [0],
    combineResults: expect.any(Function),
    editor,
    event: ExtensionHostActivationEvent.OnDefinition,
    method: 'ExtensionHostDefinition.executeDefinitionProvider',
    noProviderFoundMessage: 'no definition provider found',
  })
})

test('executeDefinitionProvider - error', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostDefinition.executeDefinitionProvider({ id: 1, uri: '' }, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
