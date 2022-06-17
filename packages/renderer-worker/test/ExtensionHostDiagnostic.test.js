import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostCore.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostManagement.js',
  () => {
    return {
      activateByEvent: jest.fn(),
    }
  }
)

const ExtensionHostDiagnostic = await import(
  '../src/parts/ExtensionHost/ExtensionHostDiagnostic.js'
)
const ExtensionHost = await import(
  '../src/parts/ExtensionHost/ExtensionHostCore.js'
)
test('executeDiagnosticProvider - no results', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
    return []
  })
  expect(
    await ExtensionHostDiagnostic.executeDiagnosticProvider({ id: 1 })
  ).toEqual([])
})

test('executeDiagnosticProvider - error', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostDiagnostic.executeDiagnosticProvider({ id: 1 })
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
