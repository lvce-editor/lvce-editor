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

test.skip('link', async () => {
  // @ts-ignore
  SymLink.createSymLink.mockImplementation(() => {})
  await ExtensionLink.link('/test/my-extension')
  expect(SymLink.createSymLink).toHaveBeenCalledTimes(1)
  expect(SymLink.createSymLink).toHaveBeenCalledWith('/test/from')
})
