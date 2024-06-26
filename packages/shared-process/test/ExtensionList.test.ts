import { expect, jest, test } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'
import * as ExtensionManifestStatus from '../src/parts/ExtensionManifestStatus/ExtensionManifestStatus.js'

jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => ({
  getExtensionsPath: jest.fn(() => {
    return '/test/extensions'
  }),
  getLinkedExtensionsPath: jest.fn(() => {
    return '/test/linked-extensions'
  }),
  getBuiltinExtensionsPath: jest.fn(() => {
    return '/test/builtin-extensions'
  }),
}))

jest.unstable_mockModule('../src/parts/ExtensionManifests/ExtensionManifests', () => ({
  getAll: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const ExtensionList = await import('../src/parts/ExtensionList/ExtensionList.js')
const ExtensionManifests = await import('../src/parts/ExtensionManifests/ExtensionManifests.js')

class NodeError extends Error {
  code: any
  constructor(code, message = code) {
    super(message)
    this.code = code
  }
}

test('list - error - folder does not exist', async () => {
  // @ts-ignore
  ExtensionManifests.getAll.mockImplementation(() => {
    return []
  })
  expect(await ExtensionList.list()).toEqual([])
})

test('list - error - permission denied', async () => {
  // @ts-ignore
  ExtensionManifests.getAll.mockImplementation(() => {
    throw new NodeError(ErrorCodes.EPERM)
  })
  await expect(ExtensionList.list()).rejects.toThrow(new Error('Failed to list extensions: EPERM'))
})

test.skip('list - error - manifest json is null', async () => {
  // @ts-ignore
  ExtensionManifests.getAll.mockImplementation(() => {
    return [null]
  })

  expect(await ExtensionList.list()).toEqual([
    {
      id: 'extension-1',
      version: 'n/a',
      symlink: '',
    },
  ])
})

test('list - error - manifest json has no id', async () => {
  // @ts-ignore
  ExtensionManifests.getAll.mockImplementation(() => {
    return [
      {
        status: ExtensionManifestStatus.Resolved,
        path: '/test/extension-1',
      },
    ]
  })
  expect(await ExtensionList.list()).toEqual([
    {
      id: 'extension-1',
      version: 'n/a',
      symlink: '',
    },
  ])
})

test('list - error - manifest version is of type array', async () => {
  // @ts-ignore
  ExtensionManifests.getAll.mockImplementation(() => {
    return [
      {
        version: [],
        status: ExtensionManifestStatus.Resolved,
        path: '/test/builtin-extensions/extension-1',
      },
    ]
  })
  expect(await ExtensionList.list()).toEqual([
    {
      id: 'extension-1',
      version: 'n/a',
      symlink: '',
    },
  ])
})

test('list - error - manifest is a directory', async () => {
  // @ts-ignore
  ExtensionManifests.getAll.mockImplementation(() => {
    return [
      {
        status: ExtensionManifestStatus.Rejected,
        reason: new NodeError(ErrorCodes.EISDIR),
      },
      {
        status: ExtensionManifestStatus.Resolved,
        path: '/test/extensions/extension-2',
      },
    ]
  })
  expect(await ExtensionList.list()).toEqual([
    {
      id: 'extension-2',
      version: 'n/a',
      symlink: '',
    },
  ])
})

// TODO test extension.json is of type symlink

test('list', async () => {
  // @ts-ignore
  ExtensionManifests.getAll.mockImplementation(() => {
    return [
      {
        id: 'extension-1',
        version: '0.0.1',
        status: ExtensionManifestStatus.Resolved,
      },
    ]
  })
  expect(await ExtensionList.list()).toEqual([
    {
      id: 'extension-1',
      version: '0.0.1',
      symlink: '',
    },
  ])
})

test('list - with symlink', async () => {
  // @ts-ignore
  ExtensionManifests.getAll.mockImplementation(() => {
    return [
      {
        id: 'extension-1',
        version: '0.0.1',
        status: ExtensionManifestStatus.Resolved,
        symlink: '../../../Documents/extension-1',
      },
    ]
  })
  expect(await ExtensionList.list()).toEqual([
    {
      id: 'extension-1',
      version: '0.0.1',
      symlink: '../../../Documents/extension-1',
    },
  ])
})
