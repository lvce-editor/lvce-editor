import { jest } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getExtensionsPath: jest.fn(() => {
    return '/test/extensions'
  }),
}))

jest.unstable_mockModule('node:fs/promises', () => ({
  readdir: jest.fn(() => {
    throw new Error('not implemented')
  }),
  readFile: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const ExtensionList = await import(
  '../src/parts/ExtensionList/ExtensionList.js'
)
const fs = await import('node:fs/promises')

class NodeError extends Error {
  constructor(code, message = code) {
    super(message)
    this.code = code
  }
}

test('list - error - folder does not exist', async () => {
  // @ts-ignore
  fs.readdir.mockImplementation(() => {
    throw new NodeError('ENOENT')
  })
  expect(await ExtensionList.list()).toEqual([])
})

test('list - error - permission denied', async () => {
  // @ts-ignore
  fs.readdir.mockImplementation(() => {
    throw new NodeError('EPERM')
  })
  await expect(ExtensionList.list()).rejects.toThrowError(
    new Error('Failed to list extensions: EPERM')
  )
})

test('list - error - manifest json is null', async () => {
  // @ts-ignore
  fs.readdir.mockImplementation(() => {
    return ['/test/extensions/extension-1']
  })
  // @ts-ignore
  fs.readFile.mockImplementation(() => {
    return 'null'
  })
  expect(await ExtensionList.list()).toEqual([
    {
      id: 'extension-1',
      version: 'n/a',
    },
  ])
})

test('list - error - manifest json has no id null', async () => {
  // @ts-ignore
  fs.readdir.mockImplementation(() => {
    return ['extension-1']
  })
  // @ts-ignore
  fs.readFile.mockImplementation(() => {
    return '{}'
  })
  expect(await ExtensionList.list()).toEqual([
    {
      id: 'extension-1',
      version: 'n/a',
    },
  ])
})

test('list - error - manifest version is of type array', async () => {
  // @ts-ignore
  fs.readdir.mockImplementation(() => {
    return ['extension-1']
  })
  // @ts-ignore
  fs.readFile.mockImplementation(() => {
    return '{ "version": [] }'
  })
  expect(await ExtensionList.list()).toEqual([
    {
      id: 'extension-1',
      version: 'n/a',
    },
  ])
})

// TODO test fails on windows
test.skip('list - error - manifest is a directory', async () => {
  // @ts-ignore
  fs.readdir.mockImplementation(() => {
    return ['extension-1', 'extension-2']
  })
  // @ts-ignore
  fs.readFile.mockImplementation((path) => {
    switch (path) {
      case '/test/extensions/extension-1/extension.json':
        throw new NodeError('EISDIR')
      case '/test/extensions/extension-2/extension.json':
        return '{}'
      default:
        throw new NodeError('ENOENT')
    }
  })
  expect(await ExtensionList.list()).toEqual([
    {
      id: 'extension-2',
      version: 'n/a',
    },
  ])
})

// TODO test extension.json is of type symlink

test('list', async () => {
  // @ts-ignore
  fs.readdir.mockImplementation(() => {
    return ['/test/extensions/extension-1']
  })
  // @ts-ignore
  fs.readFile.mockImplementation(() => {
    return '{ "id": "extension-1", "version": "0.0.1" }'
  })
  expect(await ExtensionList.list()).toEqual([
    {
      id: 'extension-1',
      version: '0.0.1',
    },
  ])
})
