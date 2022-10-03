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

const ExtensionHostImplementation = await import(
  '../src/parts/ExtensionHost/ExtensionHostImplementation.js'
)

test('executeImplementationProvider - no implementations found', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    return []
  })
  const editor = { id: 1, languageId: 'test' }
  expect(
    await ExtensionHostImplementation.executeImplementationProvider(editor, 0)
  ).toEqual([])
  expect(ExtensionHostEditor.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostEditor.execute).toHaveBeenCalledWith({
    editor,
    event: ExtensionHostActivationEvent.OnImplementation,
    combineResults: expect.any(Function),
    method: 'ExtensionHostImplementation.executeImplementationProvider',
    noProviderFoundMessage: 'No implementation provider found',
    args: [0],
  })
})

test('executeImplementationProvider - single implementation found', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    return [
      {
        uri: '/test/index.js',
        lineText: '',
        startOffset: 0,
        endOffset: 0,
      },
    ]
  })
  expect(
    await ExtensionHostImplementation.executeImplementationProvider(
      { id: 1, uri: '' },
      0
    )
  ).toEqual([
    {
      uri: '/test/index.js',
      lineText: '',
      startOffset: 0,
      endOffset: 0,
    },
  ])
})

test('executeImplementationProvider - error - implementationProvider throws error', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    throw new Error(
      'Failed to execute implementation provider: TypeError: x is not a function'
    )
  })
  await expect(
    ExtensionHostImplementation.executeImplementationProvider(
      { id: 1, uri: '' },
      0
    )
  ).rejects.toThrowError(
    new Error(
      'Failed to execute implementation provider: TypeError: x is not a function'
    )
  )
})
