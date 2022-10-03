import { jest } from '@jest/globals'
import * as ExtensionHostActivationEvent from '../src/parts/ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostShared.js',
  () => {
    return {
      executeProviders: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostDiagnostic = await import(
  '../src/parts/ExtensionHost/ExtensionHostDiagnostic.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('executeDiagnosticProvider - no results', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    return []
  })
  expect(
    await ExtensionHostDiagnostic.executeDiagnosticProvider({ id: 1 })
  ).toEqual([])
})

test('executeDiagnosticProvider - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostDiagnostic.executeDiagnosticProvider({ id: 1 })
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
