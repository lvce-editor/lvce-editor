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

const ExtensionHostReference = await import(
  '../src/parts/ExtensionHost/ExtensionHostReference.js'
)

test('executeReferenceProvider - no references found', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(() => {
    return []
  })
  expect(
    await ExtensionHostReference.executeReferenceProvider({ id: 1, uri: '' }, 0)
  ).toEqual([])
})

test('executeReferenceProvider - single reference found', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(() => {
    return [
      {
        uri: '/test/index.js',
        lineText: '',
        startOffset: 0,
        endOffset: 0,
      },
    ]
  })
  const editor = { id: 1, uri: '' }
  expect(
    await ExtensionHostReference.executeReferenceProvider(editor, 0)
  ).toEqual([
    {
      uri: '/test/index.js',
      lineText: '',
      startOffset: 0,
      endOffset: 0,
    },
  ])
  expect(ExtensionHostEditor.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostEditor.execute).toHaveBeenCalledWith({
    args: [0],
    combineResults: expect.any(Function),
    editor,
    event: ExtensionHostActivationEvent.OnReferences,
    method: 'ExtensionHostReferences.executeReferenceProvider',
    noProviderFoundMessage: 'no reference providers found',
  })
})

test('executeReferenceProvider - error - referenceProvider throws error', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    throw new Error(
      'Failed to execute reference provider: TypeError: x is not a function'
    )
  })
  await expect(
    ExtensionHostReference.executeReferenceProvider({ id: 1, uri: '' }, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute reference provider: TypeError: x is not a function'
    )
  )
})
