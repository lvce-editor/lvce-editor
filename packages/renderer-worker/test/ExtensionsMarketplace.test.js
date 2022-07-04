import { jest } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
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
const ExtensionsMarketplace = await import(
  '../src/parts/ExtensionMarketplace/ExtensionMarketplace.js'
)

afterEach(() => {
  jest.resetAllMocks()
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
    })
  ).toEqual([
    {
      id: 'microsoft.python',
      name: 'python',
      displayName: null,
      description:
        'IntelliSense (Pylance), Linting, Debugging (multi-threaded, remote), Jupyter Notebooks, code formatting, refactoring, unit tests, and more.',
      authorId: 'microsoft',
      authorName: 'Microsoft',
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
      id: 'test-author-2.test-extension',
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
      id: 'test-author.test-extension',
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
    throw new TypeError(
      'Failed to request json from "https://example.com/api/extensions/search": x is not a function'
    )
  })
  await expect(
    ExtensionsMarketplace.getMarketplaceExtensions({ q: 'abc' })
  ).rejects.toThrowError(
    new Error(
      'Failed to request json from "https://example.com/api/extensions/search": x is not a function'
    )
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
//   ).rejects.toThrowError(new TypeError('x is not a function'))
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
//   ).rejects.toThrowError(
//     new Error(
//       'Failed to request json from "https://example.com/api/extensions/search": url must be of type string'
//     )
//   )
// })
