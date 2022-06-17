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

const ExtensionHostImplementation = await import(
  '../src/parts/ExtensionHost/ExtensionHostImplementation.js'
)
const ExtensionHost = await import(
  '../src/parts/ExtensionHost/ExtensionHostCore.js'
)

test('executeImplementationProvider - no implementations found', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
    return []
  })
  expect(
    await ExtensionHostImplementation.executeImplementationProvider(
      { id: 1, uri: '' },
      0
    )
  ).toEqual([])
})

test('executeImplementationProvider - single implementation found', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
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
  ExtensionHost.invoke.mockImplementation(() => {
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
