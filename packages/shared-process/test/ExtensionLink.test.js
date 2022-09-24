import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SymLink/SymLink', () => {
  return {
    createSymLink: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getExtensionsPath: jest.fn(() => {
      return '/test/extensions'
    }),
  }
})

const SymLink = await import('../src/parts/SymLink/SymLink.js')
const ExtensionLink = await import(
  '../src/parts/ExtensionLink/ExtensionLink.js'
)
const Platform = await import('../src/parts/Platform/Platform.js')

test('link', async () => {
  // @ts-ignore
  SymLink.createSymLink.mockImplementation(() => {})
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => {
    return '/test/extensions'
  })
  await ExtensionLink.link('/test/my-extension')
  expect(SymLink.createSymLink).toHaveBeenCalledTimes(1)
  expect(SymLink.createSymLink).toHaveBeenCalledWith(
    '/test/my-extension',
    '/test/extensions/my-extension'
  )
})

// TODO handle ENOENT error when extension folder does not exist

// TODO handl ENOENT error when specified path does not exist
