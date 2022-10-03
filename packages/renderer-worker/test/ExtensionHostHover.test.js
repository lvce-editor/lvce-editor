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

const ExtensionHostHover = await import(
  '../src/parts/ExtensionHost/ExtensionHostHover.js'
)
const ExtensionHostEditor = await import(
  '../src/parts/ExtensionHost/ExtensionHostEditor.js'
)

test('executeHoverProvider - no result', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(() => {
    return {}
  })
  const editor = { id: 1, languageId: 'test' }
  expect(
    await ExtensionHostHover.executeHoverProvider(
      { id: 1, languageId: 'test' },
      0
    )
  ).toEqual({})
  expect(ExtensionHostEditor.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostEditor.execute).toHaveBeenCalledWith({
    editor,
    combineResults: expect.any(Function),
    event: ExtensionHostActivationEvent.OnHover,
    method: 'ExtensionHostHover.execute',
    noProviderFoundMessage: 'No hover provider found',
    args: [0],
  })
})

test('executeHoverProvider - error - hoverProvider throws error', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostHover.executeHoverProvider({ id: 1, languageId: 'test' }, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
