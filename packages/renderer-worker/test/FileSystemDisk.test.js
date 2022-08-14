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

const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

const FileSystemDisk = await import('../src/parts/FileSystem/FileSystemDisk.js')

test('readFile', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystem.readFile':
        return 'sample text'
      default:
        throw new Error('unexpected message')
    }
  })
  // TODO passing protocol here seems unnecessary, but it is useful for extension host which has several protocols
  expect(await FileSystemDisk.readFile('/tmp/some-file.txt')).toEqual(
    'sample text'
  )
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'FileSystem.readFile',
    '/tmp/some-file.txt'
  )
})

test('readFile - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'FileSystem.readFile':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    FileSystemDisk.readFile('/tmp/some-file.txt')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('removeFile', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystem.remove':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystemDisk.remove('/tmp/some-file.txt')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'FileSystem.remove',
    '/tmp/some-file.txt'
  )
})

test('removeFile - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'FileSystem.remove':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    FileSystemDisk.remove('/tmp/some-file.txt')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('copy', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {})
  await FileSystemDisk.copy('/test/a', '/test/b')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'FileSystem.copy',
    '/test/a',
    '/test/b'
  )
})

test('copy - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    throw new TypeError('x is not a function')
  })
  await expect(FileSystemDisk.copy('/test/a', '/test/b')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('rename', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystem.rename':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystemDisk.rename('/tmp/some-file.txt', '/tmp/renamed.txt')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'FileSystem.rename',
    '/tmp/some-file.txt',
    '/tmp/renamed.txt'
  )
})

test('rename - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'FileSystem.rename':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    FileSystemDisk.rename('/tmp/some-file.txt', '/tmp/renamed.txt')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('mkdir', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystem.mkdir':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystemDisk.mkdir('/tmp/some-dir')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'FileSystem.mkdir',
    '/tmp/some-dir'
  )
})

test('mkdir - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'FileSystem.mkdir':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystemDisk.mkdir('/tmp/some-dir')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('writeFile', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystem.writeFile':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystemDisk.writeFile('/tmp/some-file.txt', 'sample text')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'FileSystem.writeFile',
    '/tmp/some-file.txt',
    'sample text'
  )
})

test('writeFile - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystem.writeFile':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    FileSystemDisk.writeFile('/tmp/some-file.txt', 'sample text')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('readDirWithFileTypes', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        return [
          {
            name: 'file 1',
            type: 'file',
          },
          {
            name: 'file 2',
            type: 'file',
          },
          {
            name: 'file 3',
            type: 'file',
          },
        ]
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await FileSystemDisk.readDirWithFileTypes('/tmp/some-dir')).toEqual([
    {
      name: 'file 1',
      type: 'file',
    },
    {
      name: 'file 2',
      type: 'file',
    },
    {
      name: 'file 3',
      type: 'file',
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
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    FileSystemDisk.readDirWithFileTypes('/tmp/some-dir')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test.skip('watch', async () => {
  // await FileSystem.watch('/tmp/some-dir')
  // writeFile
  // FileSystem.unwatchAll()
})

test('getRealPath', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'FileSystem.getRealPath':
        return '/test/real-path.txt'
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await FileSystemDisk.getRealPath('/test/some-file.txt')).toBe(
    '/test/real-path.txt'
  )
})

test('getRealPath - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'FileSystem.mkdir':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystemDisk.mkdir('/tmp/some-dir')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})
