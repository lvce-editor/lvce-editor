import { beforeEach, expect, jest, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as EncodingType from '../src/parts/EncodingType/EncodingType.js'

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

const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')

const FileSystemDisk = await import('../src/parts/FileSystem/FileSystemDisk.js')

test.skip('readFile', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.readFile':
        return 'sample text'
      default:
        throw new Error('unexpected message')
    }
  })
  // TODO passing protocol here seems unnecessary, but it is useful for extension host which has several protocols
  expect(await FileSystemDisk.readFile('file:///tmp/some-file.txt', EncodingType.Utf8)).toEqual('sample text')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('FileSystemDisk.readFile', 'file:///tmp/some-file.txt', EncodingType.Utf8)
})

test.skip('readFile - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.readFile':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystemDisk.readFile('file:///tmp/some-file.txt')).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('removeFile', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.remove':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystemDisk.remove('file:///tmp/some-file.txt')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('FileSystemDisk.remove', 'file:///tmp/some-file.txt')
})

test.skip('removeFile - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.remove':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystemDisk.remove('file:///tmp/some-file.txt')).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('copy', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {})
  await FileSystemDisk.copy('file:///test/a', 'file:///test/b')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('FileSystemDisk.copy', 'file:///test/a', 'file:///test/b')
})

test.skip('copy - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    throw new TypeError('x is not a function')
  })
  await expect(FileSystemDisk.copy('file:///test/a', 'file:///test/b')).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('rename', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.rename':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystemDisk.rename('file:///tmp/some-file.txt', 'file:///tmp/renamed.txt')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('FileSystemDisk.rename', 'file:///tmp/some-file.txt', 'file:///tmp/renamed.txt')
})

test.skip('rename - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.rename':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystemDisk.rename('file:///tmp/some-file.txt', 'file:///tmp/renamed.txt')).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('mkdir', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.mkdir':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystemDisk.mkdir('file:///tmp/some-dir')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('FileSystemDisk.mkdir', 'file:///tmp/some-dir')
})

test.skip('mkdir - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.mkdir':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystemDisk.mkdir('file:///tmp/some-dir')).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('writeFile', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.writeFile':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystemDisk.writeFile('file:///tmp/some-file.txt', 'sample text', EncodingType.Utf8)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('FileSystemDisk.writeFile', 'file:///tmp/some-file.txt', 'sample text', EncodingType.Utf8)
})

test.skip('writeFile - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.writeFile':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystemDisk.writeFile('file:///tmp/some-file.txt', 'sample text')).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('readDirWithFileTypes', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.readDirWithFileTypes':
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
  expect(await FileSystemDisk.readDirWithFileTypes('file:///tmp/some-dir')).toEqual([
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
  expect(SharedProcess.invoke).toHaveBeenCalledWith('FileSystemDisk.readDirWithFileTypes', 'file:///tmp/some-dir')
})

test.skip('readDirWithFileTypes - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.readDirWithFileTypes':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystemDisk.readDirWithFileTypes('file:///tmp/some-dir')).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('watch', async () => {
  // await FileSystemDisk.watch('file:///tmp/some-dir')
  // writeFile
  // FileSystemDisk.unwatchAll()
})

test.skip('getRealPath', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.getRealPath':
        return 'file:///test/real-path.txt'
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await FileSystemDisk.getRealPath('file:///test/some-file.txt')).toBe('file:///test/real-path.txt')
})

test.skip('getRealPath - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'FileSystemDisk.mkdir':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystemDisk.mkdir('file:///tmp/some-dir')).rejects.toThrow(new TypeError('x is not a function'))
})
