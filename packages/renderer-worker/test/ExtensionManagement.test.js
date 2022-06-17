import { jest } from '@jest/globals'
import * as ExtensionManagement from '../src/parts/ExtensionManagement/ExtensionManagement.js'
import * as Platform from '../src/parts/Platform/Platform.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

beforeAll(() => {
  Platform.state.getMarketPlaceUrl = async () => {
    return 'https://example.com'
  }
})

test('install', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionManagement.install':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: null,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ExtensionManagement.install('test-author.test-extension')
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'ExtensionManagement.install',
    params: ['test-author.test-extension'],
  })
})

test('install - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionManagement.install':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    ExtensionManagement.install('test-author.test-extension')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('uninstall', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionManagement.uninstall':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: null,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ExtensionManagement.uninstall('test-author.test-extension')
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'ExtensionManagement.uninstall',
    params: ['test-author.test-extension'],
  })
})

test('uninstall - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionManagement.uninstall':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    ExtensionManagement.uninstall('test-author.test-extension')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('disable', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionManagement.disable':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: null,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ExtensionManagement.disable('test-author.test-extension')
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'ExtensionManagement.disable',
    params: ['test-author.test-extension'],
  })
})

test('disable - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionManagement.disable':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    ExtensionManagement.disable('test-author.test-extension')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('enable', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionManagement.enable':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: null,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ExtensionManagement.enable('test-author.test-extension')
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'ExtensionManagement.enable',
    params: ['test-author.test-extension'],
  })
})

test('enable - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionManagement.enable':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    ExtensionManagement.enable('test-author.test-extension')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('getAllExtensions', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionManagement.getAllExtensions':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: {
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
          },
        })
        break
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionManagement.getAllExtensions':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(ExtensionManagement.getAllExtensions()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('getMarketplaceUrl', async () => {})

test('getLanguages', () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 516:
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: {
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
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  // await expect()
})
