import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ImportScript/ImportScript.ts', () => {
  return {
    importScript: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Timeout/Timeout.ts', () => {
  return {
    sleep: jest.fn(() => {}),
  }
})

const ExtensionHostExtension = await import('../src/parts/ExtensionHostExtension/ExtensionHostExtension.ts')
const ImportScript = await import('../src/parts/ImportScript/ImportScript.ts')

test('activate - error - module not found', async () => {
  // @ts-ignore
  ImportScript.importScript.mockImplementation((url) => {
    throw new Error(`Failed to import ${url}: Not found (404)`)
  })
  // @ts-ignore
  globalThis.location = {
    origin: '',
  }
  await expect(
    ExtensionHostExtension.activate(
      {
        isWeb: true,
        path: '/test',
        browser: 'extension.ts',
        id: 'test',
      },
      '/test/extension.ts',
    ),
  ).rejects.toThrow(new Error('Failed to activate extension test: Failed to import /test/extension.ts: Not found (404)'))
})

test('activate - error', async () => {
  // @ts-ignore
  ImportScript.importScript.mockImplementation((url) => {
    return {
      activate() {
        throw new TypeError('x is not a function')
      },
    }
  })
  // @ts-ignore
  globalThis.location = {
    origin: '',
  }
  await expect(
    ExtensionHostExtension.activate(
      {
        isWeb: true,
        path: '/test',
        browser: 'extension.ts',
        id: 'test',
      },
      '/test/extension.ts',
    ),
  ).rejects.toThrow(new Error('Failed to activate extension test: TypeError: x is not a function'))
})

test('activate - timeout exceeded', async () => {
  // @ts-ignore
  ImportScript.importScript.mockImplementation((url) => {
    return {
      async activate() {
        await new Promise(() => {})
      },
    }
  })
  // @ts-ignore
  globalThis.location = {
    origin: '',
  }

  await expect(
    ExtensionHostExtension.activate(
      {
        isWeb: true,
        path: '/test',
        browser: 'extension.ts',
        id: 'test',
      },
      '/test/extension.ts',
    ),
  ).rejects.toThrow(new Error('Failed to activate extension test: Activation timeout of 10000ms exceeded'))
})
