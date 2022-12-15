import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ImportScript/ImportScript.js', () => {
  return {
    importScript: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ExtensionHostExtension = await import(
  '../src/parts/ExtensionHostExtension/ExtensionHostExtension.js'
)
const ImportScript = await import('../src/parts/ImportScript/ImportScript.js')

test('active - error - module not found', async () => {
  // @ts-ignore
  ImportScript.importScript.mockImplementation((url) => {
    throw new Error(`Failed to import ${url}: Not found (404)`)
  })
  // @ts-ignore
  globalThis.location = {
    origin: '',
  }
  await expect(
    ExtensionHostExtension.activate({
      isWeb: true,
      path: '/test',
      browser: 'extension.js',
      id: 'test',
    })
  ).rejects.toThrowError(
    new Error(
      `Failed to activate extension test: Failed to import /test/extension.js: Not found (404)`
    )
  )
})
