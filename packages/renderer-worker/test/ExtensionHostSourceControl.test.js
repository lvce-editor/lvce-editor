import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostManagement.js',
  () => {
    return {
      activateByEvent: jest.fn(() => {}),
    }
  }
)
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

const ExtensionHostSourceControl = await import(
  '../src/parts/ExtensionHost/ExtensionHostSourceControl.js'
)
const ExtensionHost = await import(
  '../src/parts/ExtensionHost/ExtensionHostCore.js'
)

test('acceptInput', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionHost.sourceControlAcceptInput':
        return null
      case 'ExtensionManagement.getExtensions':
        return []
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await ExtensionHostSourceControl.acceptInput('')).toBeUndefined()
})

test('acceptInput - error', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionHost.sourceControlAcceptInput':
        throw new TypeError('x is not a function')
      case 'ExtensionManagement.getExtensions':
        return []
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(ExtensionHostSourceControl.acceptInput()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

// TODO test getChangedFiles

// TODO test getFileBefore
