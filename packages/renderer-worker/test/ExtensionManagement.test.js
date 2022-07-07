import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getMarketplaceUrl: jest.fn(() => {
      return 'test://example.com'
    }),
  }
})

const ExtensionManagement = await import(
  '../src/parts/ExtensionManagement/ExtensionManagement.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

test('install', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.install':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await ExtensionManagement.install('test-author.test-extension')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ExtensionManagement.install',
    'test-author.test-extension'
  )
})

test('install - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.install':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    ExtensionManagement.install('test-author.test-extension')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('uninstall', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.uninstall':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await ExtensionManagement.uninstall('test-author.test-extension')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ExtensionManagement.uninstall',
    'test-author.test-extension'
  )
})

test('uninstall - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.uninstall':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    ExtensionManagement.uninstall('test-author.test-extension')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('disable', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.disable':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await ExtensionManagement.disable('test-author.test-extension')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ExtensionManagement.disable',
    'test-author.test-extension'
  )
})

test('disable - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.disable':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    ExtensionManagement.disable('test-author.test-extension')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('enable', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.enable':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await ExtensionManagement.enable('test-author.test-extension')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ExtensionManagement.enable',
    'test-author.test-extension'
  )
})

test('enable - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.enable':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    ExtensionManagement.enable('test-author.test-extension')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('getAllExtensions', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.getAllExtensions':
        return {
          builtinExtensions: [
            {
              id: 'builtin.language-basics-html',
              name: 'Language Basics HTML',
              description:
                'Provides syntax highlighting and bracket matching in HTML files.',
              languages: [
                {
                  id: 'html',
                  extensions: ['.html'],
                  tokenize: 'src/tokenizeHtml.js',
                  configuration: './languageConfiguration.json',
                },
              ],
            },
          ],
          installedExtensions: [
            {
              id: 'test-author-2.test-extension',
              publisher: 'test-author-2',
              description: 'Test Extension',
              name: 'test-extension',
              version: '0.0.1',
              main: 'main.js',
              path: '/tmp/extensions/test-author-2.test-extension',
            },
          ],
          disabledExtensions: [],
        }
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await ExtensionManagement.getAllExtensions()).toEqual({
    builtinExtensions: [
      {
        id: 'builtin.language-basics-html',
        name: 'Language Basics HTML',
        description:
          'Provides syntax highlighting and bracket matching in HTML files.',
        languages: [
          {
            id: 'html',
            extensions: ['.html'],
            tokenize: 'src/tokenizeHtml.js',
            configuration: './languageConfiguration.json',
          },
        ],
      },
    ],
    installedExtensions: [
      {
        id: 'test-author-2.test-extension',
        publisher: 'test-author-2',
        description: 'Test Extension',
        name: 'test-extension',
        version: '0.0.1',
        main: 'main.js',
        path: '/tmp/extensions/test-author-2.test-extension',
      },
    ],
    disabledExtensions: [],
  })
})

test('getAllExtensions - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.getAllExtensions':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(ExtensionManagement.getAllExtensions()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})
