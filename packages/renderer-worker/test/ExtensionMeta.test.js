import { jest } from '@jest/globals'
import * as ExtensionManifestStatus from '../src/parts/ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as FileSystemErrorCodes from '../src/parts/FileSystemErrorCodes/FileSystemErrorCodes.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
const ExtensionMeta = await import(
  '../src/parts/ExtensionMeta/ExtensionMeta.js'
)
const Command = await import('../src/parts/Command/Command.js')

test('organizeExtensions', () => {
  expect(
    ExtensionMeta.organizeExtensions([
      {
        id: 'builtin.language-basics-css',
        name: 'Language Basics CSS',
        description:
          'Provides syntax highlighting and bracket matching in CSS files.',
        languages: [
          {
            id: 'css',
            extensions: ['.css'],
            tokenize: 'src/tokenizeCss.js',
          },
        ],
        path: '/test/builtin.language-basics-css',
        status: ExtensionManifestStatus.Resolved,
      },
      {
        path: '/test/language-basics-markdown',
        status: ExtensionManifestStatus.Rejected,
        reason: {
          jse_shortmsg:
            'Failed to load extension "language-basics-markdown": Failed to load extension manifest',
          jse_cause: {
            errno: -20,
            code: FileSystemErrorCodes.ENOTDIR,
            syscall: 'open',
            path: '/test/language-basics-markdown/extension.json',
          },
          jse_info: {},
          message:
            'Failed to load extension "language-basics-markdown": Failed to load extension manifest: ENOTDIR: not a directory, open \'/test/language-basics-markdown/extension.json\'',
          code: 'E_LOADING_EXTENSION_MANIFEST_FAilED',
          originalStack:
            "Error: ENOTDIR: not a directory, open '/test/language-basics-markdown/extension.json'",
        },
      },
    ])
  ).toEqual({
    rejected: [
      {
        path: '/test/language-basics-markdown',
        reason: {
          code: 'E_LOADING_EXTENSION_MANIFEST_FAilED',
          jse_cause: {
            code: FileSystemErrorCodes.ENOTDIR,
            errno: -20,
            path: '/test/language-basics-markdown/extension.json',
            syscall: 'open',
          },
          jse_info: {},
          jse_shortmsg:
            'Failed to load extension "language-basics-markdown": Failed to load extension manifest',
          message:
            'Failed to load extension "language-basics-markdown": Failed to load extension manifest: ENOTDIR: not a directory, open \'/test/language-basics-markdown/extension.json\'',
          originalStack:
            "Error: ENOTDIR: not a directory, open '/test/language-basics-markdown/extension.json'",
        },
        status: ExtensionManifestStatus.Rejected,
      },
    ],
    resolved: [
      {
        description:
          'Provides syntax highlighting and bracket matching in CSS files.',
        id: 'builtin.language-basics-css',
        languages: [
          {
            extensions: ['.css'],
            id: 'css',
            tokenize: 'src/tokenizeCss.js',
          },
        ],
        name: 'Language Basics CSS',
        path: '/test/builtin.language-basics-css',
        status: 'resolved',
      },
    ],
  })
})

test('handleRejectedExtension - ignore ENOTDIR error', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  await ExtensionMeta.handleRejectedExtensions([
    {
      path: '/test/language-basics-markdown',
      status: ExtensionManifestStatus.Rejected,
      reason: {
        jse_shortmsg:
          'Failed to load extension "language-basics-markdown": Failed to load extension manifest',
        jse_cause: {
          errno: -20,
          code: FileSystemErrorCodes.ENOTDIR,
          syscall: 'open',
          path: '/test/language-basics-markdown/extension.json',
        },
        jse_info: {},
        message:
          'Failed to load extension "language-basics-markdown": Failed to load extension manifest: ENOTDIR: not a directory, open \'/test/language-basics-markdown/extension.json\'',
        code: FileSystemErrorCodes.ENOTDIR,
        originalStack:
          "Error: ENOTDIR: not a directory, open '/test/language-basics-markdown/extension.json'",
      },
    },
  ])
  expect(Command.execute).not.toHaveBeenCalled()
})

test('handleRejectedExtension - ignore E_MANIFEST_NOT_FOUND error', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  await ExtensionMeta.handleRejectedExtensions([
    {
      path: '/test/abc',
      status: ExtensionManifestStatus.Rejected,
      reason: {
        jse_shortmsg:
          'Failed to load extension "abc": Failed to load extension manifest',
        jse_cause: {
          errno: -2,
          code: FileSystemErrorCodes.E_MANIFEST_NOT_FOUND,
          syscall: 'open',
          path: '/test/abc/extension.json',
        },
        jse_info: {},
        message:
          'Failed to load extension "abc": Failed to load extension manifest: File not found \'/test/abc/extension.json\'',
        code: FileSystemErrorCodes.E_MANIFEST_NOT_FOUND,
        originalStack: "Error: File not found '/test/abc/extension.json'",
      },
    },
  ])
  expect(Command.execute).not.toHaveBeenCalled()
})

test('handleRejectedExtension - show error message for other error', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  await ExtensionMeta.handleRejectedExtensions([
    {
      path: '/test/abc',
      status: ExtensionManifestStatus.Rejected,
      reason: {
        message: 'TypeError: x is not a function',
      },
    },
  ])
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Dialog.showMessage', {
    codeFrame: '',
    message: 'TypeError: x is not a function',
    stack: '',
  })
})

test('filterByMatchingEvent', () => {
  expect(
    ExtensionMeta.filterByMatchingEvent(
      [
        {
          activation: ['onCommand:xyz'],
        },
      ],
      'onCommand:xyz'
    )
  ).toEqual([
    {
      activation: ['onCommand:xyz'],
    },
  ])
})
