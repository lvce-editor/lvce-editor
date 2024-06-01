import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as EncodingType from '../src/parts/EncodingType/EncodingType.js'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as FileSystemState from '../src/parts/FileSystemState/FileSystemState.js'
import * as FileSystem from '../src/parts/FileSystem/FileSystem.js'

const readFile = jest.fn()
const writeFile = jest.fn()
const remove = jest.fn()

FileSystemState.registerAll({
  test() {
    return {
      readFile,
      writeFile,
      remove,
    }
  },
})

beforeEach(() => {
  jest.resetAllMocks()
})

test('readFile', async () => {
  readFile.mockReturnValue('sample text')
  expect(await FileSystem.readFile('test://some-file.txt')).toEqual('sample text')
  expect(readFile).toHaveBeenCalledWith('FileSystem.readFile', '/tmp/some-file.txt')
})

test('readFile - error', async () => {
  readFile.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(FileSystem.readFile('/tmp/some-file.txt')).rejects.toThrow(new TypeError('x is not a function'))
})

test('removeFile', async () => {
  remove.mockReturnValue(null)
  await FileSystem.remove('test://some-file.txt')
  expect(remove).toHaveBeenCalledTimes(1)
  expect(remove).toHaveBeenCalledWith('some-file.txt')
})

test('removeFile - error', async () => {
  remove.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(FileSystem.remove('/tmp/some-file.txt')).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('rename', async () => {
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
  // @ts-ignore
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(SharedProcess.invoke).toHaveBeenCalledWith('FileSystem.rename', '/tmp/some-file.txt', '/tmp/renamed.txt')
})

test.skip('rename - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.rename':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystem.rename('/tmp/some-file.txt', '/tmp/renamed.txt')).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('mkdir', async () => {
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
  // @ts-ignore
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(SharedProcess.invoke).toHaveBeenCalledWith('FileSystem.mkdir', '/tmp/some-dir')
})

test.skip('mkdir - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.mkdir':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystem.mkdir('/tmp/some-dir')).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('writeFile', async () => {
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
  // @ts-ignore
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(SharedProcess.invoke).toHaveBeenCalledWith('FileSystem.writeFile', '/tmp/some-file.txt', 'sample text', EncodingType.Utf8)
})

test.skip('writeFile - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.writeFile':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystem.writeFile('/tmp/some-file.txt', 'sample text')).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('readDirWithFileTypes', async () => {
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
  // @ts-ignore
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(SharedProcess.invoke).toHaveBeenCalledWith('FileSystem.readDirWithFileTypes', '/tmp/some-dir')
})

test.skip('readDirWithFileTypes - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystem.readDirWithFileTypes('/tmp/some-dir')).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('watch', async () => {
  // await FileSystem.watch('/tmp/some-dir')
  // writeFile
  // FileSystem.unwatchAll()
})
