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

const ExtensionHostDiagnostic = await import(
  '../src/parts/ExtensionHost/ExtensionHostDiagnostic.js'
)

test('executeDiagnosticProvider - no results', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    return []
  })
  const editor = { id: 1 }
  expect(
    await ExtensionHostDiagnostic.executeDiagnosticProvider(editor)
  ).toEqual([])
  expect(ExtensionHostEditor.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostEditor.execute).toHaveBeenCalledWith({
    args: [],
    combineResults: expect.any(Function),
    editor,
    event: ExtensionHostActivationEvent.OnDiagnostic,
    method: 'ExtensionHost.executeDiagnosticProvider',
    noProviderFoundMessage: 'no diagnostic provider found',
    noProviderResult: [],
  })
})

test('executeDiagnosticProvider - error', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostDiagnostic.executeDiagnosticProvider({ id: 1 })
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
