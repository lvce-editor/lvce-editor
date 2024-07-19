import { afterEach, beforeAll, expect, jest, test } from '@jest/globals'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'

jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => ({
  getMarketPlaceUrl() {
    return 'https://example.com'
  },
}))

jest.unstable_mockModule('../src/parts/Ajax/Ajax.js', () => ({
  getJson: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const Ajax = await import('../src/parts/Ajax/Ajax.js')
const Command = await import('../src/parts/Command/Command.js')
const ExtensionsMarketplace = await import('../src/parts/ExtensionMarketplace/ExtensionMarketplace.js')

afterEach(() => {
  jest.resetAllMocks()
})

beforeAll(() => {
  Command.setLoad((moduleId) => {
    switch (moduleId) {
      case ModuleId.Ajax:
        return import('../src/parts/Ajax/Ajax.ipc.js')
      default:
        throw new Error(`module not found ${moduleId}`)
    }
  })
})

test('getMarketplaceExtensions', async () => {
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return [
      {
        id: 'test-author-1.test-extension-1',
        name: 'test-extension',
        displayName: null,
        description: 'Test Extension',
        authorId: 'test-author',
        authorName: 'Test Author',
        createdAt: '',
        updatedAt: '',
        version: '0.0.1',
        versions: [
          {
            _id: '0.0.1',
            created: '',
            readme: 'README.md',
            changelog: null,
            license: null,
          },
        ],
      },
      {
        id: 'test-author-2.test-extension-2',
        name: 'test-extension',
        displayName: null,
        description: 'Test Extension',
        authorId: 'test-author-2',
        authorName: 'Test Author 2',
        createdAt: '',
        updatedAt: '',
        version: '0.0.1',
        versions: [
          {
            _id: '0.0.1',
            created: '',
            readme: 'README.md',
            changelog: 'CHANGELOG.md',
            license: 'LICENSE.md',
          },
        ],
      },
      {
        id: 'test-author-3.test-extension-3',
        name: 'test-extension',
        displayName: null,
        description: 'Test Extension',
        authorId: 'test-author',
        authorName: 'Test Author',
        createdAt: '',
        updatedAt: '',
        version: '0.0.1',
        versions: [
          {
            _id: '0.0.1',
            created: '',
            readme: 'README.md',
            changelog: null,
            license: null,
          },
        ],
      },
    ]
  })
  expect(
    await ExtensionsMarketplace.getMarketplaceExtensions({
      q: 'abc',
    }),
  ).toEqual([
    {
      id: 'test-author-1.test-extension-1',
      name: 'test-extension',
      displayName: null,
      description: 'Test Extension',
      authorId: 'test-author',
      authorName: 'Test Author',
      createdAt: '',
      updatedAt: '',
      version: '0.0.1',
      versions: [
        {
          _id: '0.0.1',
          created: '',
          readme: 'README.md',
          changelog: null,
          license: null,
        },
      ],
    },
    {
      id: 'test-author-2.test-extension-2',
      name: 'test-extension',
      displayName: null,
      description: 'Test Extension',
      authorId: 'test-author-2',
      authorName: 'Test Author 2',
      createdAt: '',
      updatedAt: '',
      version: '0.0.1',
      versions: [
        {
          _id: '0.0.1',
          created: '',
          readme: 'README.md',
          changelog: 'CHANGELOG.md',
          license: 'LICENSE.md',
        },
      ],
    },
    {
      id: 'test-author-3.test-extension-3',
      name: 'test-extension',
      displayName: null,
      description: 'Test Extension',
      authorId: 'test-author',
      authorName: 'Test Author',
      createdAt: '',
      updatedAt: '',
      version: '0.0.1',
      versions: [
        {
          _id: '0.0.1',
          created: '',
          readme: 'README.md',
          changelog: null,
          license: null,
        },
      ],
    },
  ])
})

test('getMarketplaceExtensions - error', async () => {
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    throw new TypeError('Failed to request json from "https://example.com/api/extensions/search": x is not a function')
  })
  await expect(ExtensionsMarketplace.getMarketplaceExtensions({ q: 'abc' })).rejects.toThrow(
    new Error('Failed to request json from "https://example.com/api/extensions/search": x is not a function'),
  )
})

// TODO enable these tests again

// test('getMarketplaceExtensions', async () => {
//   SharedProcess.state.send = jest.fn((message) => {
//     switch (message.method) {
//       case 519:
//         SharedProcess.state.receive({
//           jsonrpc: '2.0',
//           id: message.id,
//           result: 'https://example.com',
//         })
//         break
//       default:
//         throw new Error('unexpected message')
//     }
//   })
//   Ajax.state.getJson = jest.fn(async () => {
//     return []
//   })
//   expect(await ExtensionManagement.getMarketplaceExtensions()).toEqual([])
// })

// test('getMarketplaceExtensions - error with getMarketplaceUrl', async () => {
//   SharedProcess.state.send = jest.fn((message) => {
//     switch (message.method) {
//       case 519:
//         SharedProcess.state.receive({
//           jsonrpc: '2.0',
//           id: message.id,
//           error: {
//             message: 'TypeError: x is not a function',
//           },
//         })
//         break
//       default:
//         throw new Error('unexpected message')
//     }
//   })
//   Ajax.state.getJson = jest.fn(async () => {
//     return []
//   })
//   await expect(
//     ExtensionManagement.getMarketplaceExtensions()
//   ).rejects.toThrow(new TypeError('x is not a function'))
// })

// test('getMarketplaceExtensions - getMarketplaceUrl should only be called once', async () => {
//   SharedProcess.state.send = jest.fn((message) => {
//     switch (message.method) {
//       case 519:
//         SharedProcess.state.receive({
//           jsonrpc: '2.0',
//           id: message.id,
//           result: 'https://example.com',
//         })
//         break
//       default:
//         throw new Error('unexpected message')
//     }
//   })
//   Ajax.state.getJson = jest.fn(async () => {
//     return []
//   })
//   await Promise.all([
//     ExtensionManagement.getMarketplaceExtensions(),
//     ExtensionManagement.getMarketplaceExtensions(),
//   ])
//   expect(SharedProcess.state.send).toHaveBeenCalledTimes(1)
// })

// test('getMarketplaceExtensions - error with ajax', async () => {
//   SharedProcess.state.send = jest.fn((message) => {
//     switch (message.method) {
//       case 519:
//         SharedProcess.state.receive({
//           jsonrpc: '2.0',
//           id: message.id,
//           result: 'https://example.com',
//         })
//         break
//       default:
//         throw new Error('unexpected message')
//     }
//   })
//   Ajax.state.getJson = jest.fn(async () => {
//     throw new TypeError('url must be of type string')
//   })
//   await expect(
//     ExtensionManagement.getMarketplaceExtensions()
//   ).rejects.toThrow(
//     new Error(
//       'Failed to request json from "https://example.com/api/extensions/search": url must be of type string'
//     )
//   )
// })
