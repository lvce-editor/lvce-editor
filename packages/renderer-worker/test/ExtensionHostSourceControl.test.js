import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostShared.js',
  () => {
    return {
      executeProvider: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostSourceControl = await import(
  '../src/parts/ExtensionHost/ExtensionHostSourceControl.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('acceptInput', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    return undefined
  })
  expect(await ExtensionHostSourceControl.acceptInput('')).toBeUndefined()
})

test('acceptInput - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ExtensionHostSourceControl.acceptInput()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

// TODO test getChangedFiles

// TODO test getFileBefore
