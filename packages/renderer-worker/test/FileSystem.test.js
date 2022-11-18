import { jest } from '@jest/globals'
import * as EncodingType from '../src/parts/EncodingType/EncodingType.js'
import * as DirentType from '../src/parts/DirentType/DirentType.js'

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

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

// TODO duplicate test code with FileSystemDisk.test.js

test('readFile', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.readFile':
        return 'sample text'
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await FileSystem.readFile('/tmp/some-file.txt')).toEqual('sample text')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'FileSystem.readFile',
    '/tmp/some-file.txt',
    EncodingType.Utf8
  )
})

test('readFile - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'FileSystem.readFile':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystem.readFile('/tmp/some-file.txt')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('removeFile', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.remove':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystem.remove('/tmp/some-file.txt')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'FileSystem.remove',
    '/tmp/some-file.txt'
  )
})

test('removeFile - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'FileSystem.remove':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystem.remove('/tmp/some-file.txt')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('rename', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.rename':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystem.rename('/tmp/some-file.txt', '/tmp/renamed.txt')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'FileSystem.rename',
    '/tmp/some-file.txt',
    '/tmp/renamed.txt'
  )
})

test('rename - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.rename':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    FileSystem.rename('/tmp/some-file.txt', '/tmp/renamed.txt')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('mkdir', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.mkdir':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystem.mkdir('/tmp/some-dir')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'FileSystem.mkdir',
    '/tmp/some-dir'
  )
})

test('mkdir - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.mkdir':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystem.mkdir('/tmp/some-dir')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('writeFile', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.writeFile':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystem.writeFile('/tmp/some-file.txt', 'sample text')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'FileSystem.writeFile',
    '/tmp/some-file.txt',
    'sample text',
    EncodingType.Utf8
  )
})

test('writeFile - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.writeFile':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    FileSystem.writeFile('/tmp/some-file.txt', 'sample text')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('readDirWithFileTypes', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        return [
          {
            name: 'file 1',
            type: DirentType.File,
          },
          {
            name: 'file 2',
            type: DirentType.File,
          },
          {
            name: 'file 3',
            type: DirentType.File,
          },
        ]
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await FileSystem.readDirWithFileTypes('/tmp/some-dir')).toEqual([
    {
      name: 'file 1',
      type: DirentType.File,
    },
    {
      name: 'file 2',
      type: DirentType.File,
    },
    {
      name: 'file 3',
      type: DirentType.File,
    },
  ])
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'FileSystem.readDirWithFileTypes',
    '/tmp/some-dir'
  )
})

test('readDirWithFileTypes - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    FileSystem.readDirWithFileTypes('/tmp/some-dir')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test.skip('watch', async () => {
  // await FileSystem.watch('/tmp/some-dir')
  // writeFile
  // FileSystem.unwatchAll()
})
