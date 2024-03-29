// @ts-nocheck
import { beforeEach, expect, jest, test } from '@jest/globals'
import { join } from 'node:path'
import { setTimeout } from 'node:timers/promises'
import * as EncodingType from '../src/parts/EncodingType/EncodingType.js'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('node:fs/promises', () => {
  return {
    cp: jest.fn(() => {
      throw new Error('not implemented')
    }),
    mkdir: jest.fn(() => {
      throw new Error('not implemented')
    }),
    readDirWithFileTypes: jest.fn(() => {
      throw new Error('not implemented')
    }),
    readFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
    readlink: jest.fn(() => {
      throw new Error('not implemented')
    }),
    realpath: jest.fn(() => {
      throw new Error('not implemented')
    }),
    rename: jest.fn(() => {
      throw new Error('not implemented')
    }),
    writeFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
    rm: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Trash/Trash.js', () => {
  return {
    trash: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const Trash = await import('../src/parts/Trash/Trash.js')
const fs = await import('node:fs/promises')

class NodeError extends Error {
  constructor(code, message = code) {
    super(message)
    this.code = code
  }
}

test('copy - file', async () => {
  // @ts-ignore
  fs.cp.mockImplementation(() => {})
  await FileSystem.copy('/test-1/a.txt', '/test-2/a.txt')
  expect(fs.cp).toHaveBeenCalledTimes(1)
  expect(fs.cp).toHaveBeenCalledWith('/test-1/a.txt', '/test-2/a.txt', {
    recursive: true,
  })
})

test('copy - error - source does not exist', async () => {
  // @ts-ignore
  fs.cp.mockImplementation((source) => {
    throw new Error(`ENOENT: no such file or directory, lstat '${source}'`)
  })
  await expect(FileSystem.copy('/test-1/a.txt', '/test-2/a.txt')).rejects.toThrow(
    new Error(`Failed to copy "/test-1/a.txt" to "/test-2/a.txt": ENOENT: no such file or directory, lstat '/test-1/a.txt'`),
  )
})

test('copy - to self', async () => {
  // @ts-ignore
  fs.cp.mockImplementation((source) => {
    throw new Error(`Invalid src or dest: cp returned EINVAL (src and dest cannot be the same)`)
  })
  await expect(FileSystem.copy('/test/a.txt', '/test/a.txt')).rejects.toThrow(
    new Error(`Failed to copy "/test/a.txt" to "/test/a.txt": src and dest cannot be the same`),
  )
})

test('createFile', async () => {
  // @ts-ignore
  fs.writeFile.mockImplementation(() => {})
  await FileSystem.createFile('/test/a.txt')
  expect(fs.writeFile).toHaveBeenCalledTimes(1)
  expect(fs.writeFile).toHaveBeenCalledWith('/test/a.txt', '', { flag: 'wx' })
})

test('createFile - should throw error if file already exists', async () => {
  // @ts-ignore
  fs.writeFile.mockImplementation((path) => {
    throw new Error(`EEXIST: file already exists, open '${path}'`)
  })
  expect(FileSystem.createFile('/test/a.txt')).rejects.toThrow(`Failed to create file "/test/a.txt": EEXIST: file already exists, open '/test/a.txt'`)
})

test('create folder', async () => {
  // @ts-ignore
  fs.mkdir.mockImplementation(() => {})
  await FileSystem.createFolder('/test/a', {})
  expect(fs.mkdir).toHaveBeenCalledTimes(1)
  expect(fs.mkdir).toHaveBeenCalledWith('/test/a', {})
})

test('create folder - should fail if folder already exists', async () => {
  // @ts-ignore
  fs.mkdir.mockImplementation((path) => {
    throw new Error(`EEXIST: file already exists, mkdir '${path}'`)
  })
  expect(FileSystem.createFolder('/test/a')).rejects.toThrow(`Failed to create folder "/test/a": EEXIST: file already exists, mkdir '/test/a'`)
})

// TODO test recursive create folder

test('writeFile', async () => {
  // @ts-ignore
  fs.writeFile.mockImplementation(() => {})
  await FileSystem.writeFile('/test/a.txt', 'Hello World')
  expect(fs.writeFile).toHaveBeenCalledTimes(1)
  expect(fs.writeFile).toHaveBeenCalledWith('/test/a.txt', 'Hello World', EncodingType.Utf8)
})

test('writeFile - nonexistent file', async () => {
  // @ts-ignore
  fs.writeFile.mockImplementation(() => {
    throw new NodeError(ErrorCodes.ENOENT)
  })
  await expect(FileSystem.writeFile('/test/non-existing-file.txt', 'Hello World')).rejects.toThrow(`File not found: '/test/non-existing-file.txt'`)
})

test.skip('writeFile - parallel write on different files works', async () => {
  // queue would be correct but slower

  // @ts-ignore
  const tmpDir = await getTmpDir()
  const testFile1 = join(tmpDir, 'writefile1.txt')
  const testFile2 = join(tmpDir, 'writefile2.txt')
  const testFile3 = join(tmpDir, 'writefile3.txt')
  const testFile4 = join(tmpDir, 'writefile4.txt')
  const testFile5 = join(tmpDir, 'writefile5.txt')

  await Promise.all([
    FileSystem.writeFile(testFile1, 'Hello World 1'),
    FileSystem.writeFile(testFile2, 'Hello World 2'),
    FileSystem.writeFile(testFile3, 'Hello World 3'),
    FileSystem.writeFile(testFile4, 'Hello World 4'),
    FileSystem.writeFile(testFile5, 'Hello World 5'),
  ])
  // @ts-ignore
  expect(fs.readFileSync(testFile1, EncodingType.Utf8)).toBe('Hello World 1')
  // @ts-ignore
  expect(fs.readFileSync(testFile2, EncodingType.Utf8)).toBe('Hello World 2')
  // @ts-ignore
  expect(fs.readFileSync(testFile3, EncodingType.Utf8)).toBe('Hello World 3')
  // @ts-ignore
  expect(fs.readFileSync(testFile4, EncodingType.Utf8)).toBe('Hello World 4')
  // @ts-ignore
  expect(fs.readFileSync(testFile5, EncodingType.Utf8)).toBe('Hello World 5')
})

test.skip('writeFile - parallel write on same files works and is sequentialized', async () => {
  // queue would be correct but slower

  const tmpDir = await getTmpDir()
  const testFile = join(tmpDir, 'writefile.txt')
  await Promise.all([
    FileSystem.writeFile(testFile, 'Hello World 1'),
    FileSystem.writeFile(testFile, 'Hello World 2'),
    setTimeout(10).then(() => FileSystem.writeFile(testFile, 'Hello World 3')),
    FileSystem.writeFile(testFile, 'Hello World 4'),
    setTimeout(10).then(() => FileSystem.writeFile(testFile, 'Hello World 5')),
  ])
  expect(fs.readFileSync(testFile, EncodingType.Utf8)).toBe('Hello World 5')
})

test.skip('writeFile (string, error handling)', async () => {
  const tmpDir = await getTmpDir()
  const testFile = join(tmpDir, 'flushed.txt')
  fs.mkdirSync(testFile) // this will trigger an error later because testFile is now a directory!
  let expectedError
  try {
    await FileSystem.writeFile(testFile, 'Hello World')
  } catch (error) {
    expectedError = error
  }
  expect(expectedError).toBeDefined()
})

test('ensureFile - created parent folders recursively', async () => {
  // @ts-ignore
  fs.mkdir.mockImplementation(() => {})
  // @ts-ignore
  fs.writeFile.mockImplementation(() => {})
  await FileSystem.ensureFile('/test/a/b/c/d/writefile.txt', 'Hello World')
  expect(fs.mkdir).toHaveBeenCalledTimes(1)
  expect(fs.mkdir).toHaveBeenCalledWith('/test/a/b/c/d', { recursive: true })
  expect(fs.writeFile).toHaveBeenCalledTimes(1)
  expect(fs.writeFile).toHaveBeenCalledWith('/test/a/b/c/d/writefile.txt', 'Hello World')
})

test('remove', async () => {
  // @ts-ignore
  Trash.trash.mockImplementation(() => {})
  await FileSystem.remove('/test/file-to-be-removed.txt')
  expect(Trash.trash).toHaveBeenCalledTimes(1)
  expect(Trash.trash).toHaveBeenCalledWith('/test/file-to-be-removed.txt')
})

test('remove - non-existing file', async () => {
  // @ts-ignore
  Trash.trash.mockImplementation(() => {})
  await FileSystem.remove('/test/non-existing.txt')
  expect(Trash.trash).toHaveBeenCalledTimes(1)
  expect(Trash.trash).toHaveBeenCalledWith('/test/non-existing.txt')
})

test('rename', async () => {
  // @ts-ignore
  fs.rename.mockImplementation(() => {})
  await FileSystem.rename('/test/file-to-be-moved.txt', '/test/file-has-been-moved.txt')
  expect(fs.rename).toHaveBeenCalledTimes(1)
  expect(fs.rename).toHaveBeenCalledWith('/test/file-to-be-moved.txt', '/test/file-has-been-moved.txt')
})

test('rename - error - non existing old path', async () => {
  // @ts-ignore
  fs.rename.mockImplementation(() => {
    throw new Error(ErrorCodes.ENOENT)
  })
  await expect(FileSystem.rename('/test/non-existing.txt', '/test/file-has-been-moved.txt')).rejects.toThrow(
    `Failed to rename "/test/non-existing.txt" to "/test/file-has-been-moved.txt": ENOENT`,
  )
})

test('rename - error - EXDEV', async () => {
  // @ts-ignore
  fs.rename.mockImplementation(() => {
    throw new NodeError(ErrorCodes.EXDEV)
  })
  // @ts-ignore
  fs.cp.mockImplementation(() => {})
  // @ts-ignore
  fs.rm.mockImplementation(() => {})
  await FileSystem.rename('/test/non-existing.txt', '/test/file-has-been-moved.txt')
  expect(fs.cp).toHaveBeenCalledTimes(1)
  expect(fs.cp).toHaveBeenCalledWith('/test/non-existing.txt', '/test/file-has-been-moved.txt', { recursive: true })
  expect(fs.rm).toHaveBeenCalledTimes(1)
  expect(fs.rm).toHaveBeenCalledWith('/test/non-existing.txt', {
    recursive: true,
  })
})

test('rename - error - new path in non-existing nested directory', async () => {
  // @ts-ignore
  fs.rename.mockImplementation(() => {
    throw new Error(ErrorCodes.ENOENT)
  })
  await expect(FileSystem.rename('/test/file-to-be-moved.txt', '/test/nested/nested/nested/file-has-been-moved.txt')).rejects.toThrow(
    `Failed to rename "/test/file-to-be-moved.txt" to "/test/nested/nested/nested/file-has-been-moved.txt": ENOENT`,
  )
})

const waitForWatcherReady = async (watcher) => {
  await new Promise((resolve) => {
    watcher.once('ready', async () => {
      // try to fix tests on macos through timeout :/
      await setTimeout(100)
      resolve(undefined)
    })
  })
}

// TODO all file watcher tests are very flaky on macos/windows ci

test.skip('watch - add', async () => {
  const tmpDir = await getTmpDir()
  const watcher = FileSystem.watch(tmpDir)
  const events = []
  let _resolve
  let i = 0
  await waitForWatcherReady(watcher)
  watcher.on('all', (...args) => {
    events.push([args[0], args[1]])
    i++
    if (i === 2) {
      _resolve()
    }
  })
  const resolvePromise = new Promise((resolve) => {
    _resolve = resolve
  })
  await fs.promises.writeFile(join(tmpDir, 'abc.txt'), 'sample text')
  await fs.promises.writeFile(join(tmpDir, 'def.txt'), 'sample text')
  await resolvePromise
  await setTimeout(1000)
  expect(events).toEqual([
    ['add', join(tmpDir, 'abc.txt')],
    ['add', join(tmpDir, 'def.txt')],
  ])
  watcher.close()
})

test.skip('watch - remove', async () => {
  const tmpDir = await getTmpDir()
  await fs.promises.writeFile(join(tmpDir, 'abc.txt'), 'sample text')
  const watcher = FileSystem.watch(tmpDir)
  const events = []
  let _resolve
  let i = 0
  await waitForWatcherReady(watcher)
  watcher.on('all', (...args) => {
    events.push([args[0], args[1]])
    i++
    if (i === 1) {
      _resolve()
    }
  })
  const resolvePromise = new Promise((resolve) => {
    _resolve = resolve
  })
  await fs.promises.rm(join(tmpDir, 'abc.txt'))
  await resolvePromise
  await setTimeout(1000)
  expect(events).toEqual([['unlink', join(tmpDir, 'abc.txt')]])
  watcher.close()
})

test.skip('watch - rename', async () => {
  const tmpDir = await getTmpDir()
  await fs.promises.writeFile(join(tmpDir, 'abc.txt'), 'sample text')
  const watcher = FileSystem.watch(tmpDir)
  const events = []
  let _resolve
  let i = 0
  await waitForWatcherReady(watcher)
  watcher.on('all', (...args) => {
    events.push([args[0], args[1]])
    i++
    if (i === 2) {
      _resolve()
    }
  })
  const resolvePromise = new Promise((resolve) => {
    _resolve = resolve
  })
  await fs.promises.rename(join(tmpDir, 'abc.txt'), join(tmpDir, 'def.txt'))
  await resolvePromise
  await setTimeout(1000)
  expect(events).toEqual([
    ['add', join(tmpDir, 'def.txt')],
    ['unlink', join(tmpDir, 'abc.txt')],
  ])
  watcher.close()
})

test('getPathSeparator', () => {
  expect(FileSystem.getPathSeparator()).toEqual(expect.any(String))
})

test('getRealPath', async () => {
  // @ts-ignore
  fs.realpath.mockImplementation(() => {
    return '/test/b.txt'
  })
  expect(await FileSystem.getRealPath('/test/a.txt')).toBe('/test/b.txt')
})

test('getRealPath - error - broken symlink - file not found', async () => {
  // @ts-ignore
  fs.realpath.mockImplementation((source) => {
    throw new NodeError(ErrorCodes.ENOENT)
  })
  // @ts-ignore
  fs.readlink.mockImplementation(() => {
    return '/test/non-existing.txt'
  })
  await expect(FileSystem.getRealPath('/test-1/a.txt')).rejects.toThrow(new Error(`Broken symbolic link: File not found /test/non-existing.txt`))
})

test('getRealPath - error - broken symlink and error with readlink', async () => {
  // @ts-ignore
  fs.realpath.mockImplementation((source) => {
    throw new NodeError(ErrorCodes.ENOENT)
  })
  // @ts-ignore
  fs.readlink.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(FileSystem.getRealPath('/test-1/a.txt')).rejects.toThrow(new Error(`Failed to resolve real path for /test-1/a.txt: ENOENT`))
})

test('readFile - error - file not found', async () => {
  // @ts-ignore
  fs.readFile.mockImplementation(() => {
    throw new NodeError(ErrorCodes.ENOENT)
  })
  await expect(FileSystem.readFile('/test/non-existing.txt')).rejects.toThrow(new Error(`File not found: '/test/non-existing.txt'`))
})

test('readFile - error - permission denied', async () => {
  // @ts-ignore
  fs.readFile.mockImplementation(() => {
    throw new NodeError(ErrorCodes.EACCES, `EACCES: permission denied, open \'/test/no-permission.txt\'`)
  })
  await expect(FileSystem.readFile('/test/no-permission.txt')).rejects.toThrow(
    new Error('Failed to read file "/test/no-permission.txt": EACCES: permission denied, open \'/test/no-permission.txt\''),
  )
})
