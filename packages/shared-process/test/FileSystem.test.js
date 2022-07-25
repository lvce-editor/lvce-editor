import * as fs from 'node:fs'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout } from 'node:timers/promises'
import * as FileSystem from '../src/parts/FileSystem/FileSystem.js'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

test('copy - file', async () => {
  const tmpDir1 = await getTmpDir()
  const source = join(tmpDir1, 'a.txt')
  await writeFile(source, 'a')
  const tmpDir2 = await getTmpDir()
  const target = join(tmpDir2, 'a.txt')
  await FileSystem.copy(source, target)
  expect(await fs.promises.readFile(target, 'utf8')).toBe('a')
})

test('copy - error - source does not exist', async () => {
  const tmpDir1 = await getTmpDir()
  const source = join(tmpDir1, 'a.txt')
  const tmpDir2 = await getTmpDir()
  const target = join(tmpDir2, 'a.txt')
  await expect(FileSystem.copy(source, target)).rejects.toThrowError(
    new Error(
      `Failed to copy "${source}" to "${target}": ENOENT: no such file or directory, lstat '${source}'`
    )
  )
})

test('copy - to self', async () => {
  const tmpDir1 = await getTmpDir()
  const source = join(tmpDir1, 'a.txt')
  await writeFile(source, 'a')
  const target = source
  await expect(FileSystem.copy(source, target)).rejects.toThrowError(
    new Error(
      `Failed to copy "${source}" to "${target}": Invalid src or dest: cp returned EINVAL (src and dest cannot be the same) ${source}`
    )
  )
})

test('createFile', async () => {
  const tmpDir = await getTmpDir()
  const testFile = join(tmpDir, 'a.txt')
  await FileSystem.createFile(testFile)
  expect(await fs.promises.readFile(testFile, 'utf8')).toBe('')
})

test('createFile - should throw error if file already exists', async () => {
  const tmpDir = await getTmpDir()
  const testFile = join(tmpDir, 'a.txt')
  await fs.promises.writeFile(testFile, 'abc')
  expect(FileSystem.createFile(testFile)).rejects.toThrowError(
    `Failed to create file "${testFile}": EEXIST: file already exists, open '${testFile}'`
  )
})

test('create folder', async () => {
  const tmpDir = await getTmpDir()
  const testFolder = join(tmpDir, 'a')
  await FileSystem.createFolder(testFolder)
  expect(await fs.promises.readdir(tmpDir)).toEqual(['a'])
})

test('create folder - should fail if folder already exists', async () => {
  const tmpDir = await getTmpDir()
  const testFolder = join(tmpDir, 'a')
  await fs.promises.mkdir(testFolder)
  expect(FileSystem.createFolder(testFolder)).rejects.toThrowError(
    `Failed to create folder "${testFolder}": EEXIST: file already exists, mkdir '${testFolder}'`
  )
})

// TODO test recursive create folder

test('writeFile', async () => {
  const tmpDir = await getTmpDir()
  const testFile = join(tmpDir, 'writefile.txt')
  expect(await FileSystem.exists(testFile)).toBe(false)
  await FileSystem.writeFile(testFile, 'Hello World')
  expect(await fs.promises.readFile(testFile, 'utf8')).toBe('Hello World')
})

test('writeFile - nonexistent file', async () => {
  const tmpDir = await getTmpDir()
  const tmpFile = join(tmpDir, 'folder', 'non-existing-file.txt')
  await expect(FileSystem.writeFile(tmpFile, 'Hello World')).rejects.toThrow(
    `Failed to write to file "${tmpFile}": ENOENT`
  )
})

test.skip('writeFile - parallel write on different files works', async () => {
  // queue would be correct but slower

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
  expect(fs.readFileSync(testFile1, 'utf8')).toBe('Hello World 1')
  expect(fs.readFileSync(testFile2, 'utf8')).toBe('Hello World 2')
  expect(fs.readFileSync(testFile3, 'utf8')).toBe('Hello World 3')
  expect(fs.readFileSync(testFile4, 'utf8')).toBe('Hello World 4')
  expect(fs.readFileSync(testFile5, 'utf8')).toBe('Hello World 5')
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
  expect(fs.readFileSync(testFile, 'utf8')).toBe('Hello World 5')
})

test('writeFile (string, error handling)', async () => {
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
  const tmpDir = await getTmpDir()
  const testFile = join(tmpDir, 'a', 'b', 'c', 'd', 'writefile.txt')
  expect(await FileSystem.exists(testFile)).toBe(false)
  await FileSystem.ensureFile(testFile, 'Hello World')
  expect(await fs.promises.readFile(testFile, 'utf8')).toBe('Hello World')
})

test('remove', async () => {
  const tmpDir = await getTmpDir()
  const testFile = join(tmpDir, 'file-to-be-removed.txt')
  await fs.promises.writeFile(testFile, '')
  await FileSystem.remove(testFile)
  expect(fs.existsSync(testFile)).toBe(false)
})

test('remove - non-existing file', async () => {
  const tmpDir = await getTmpDir()
  const testFile = join(tmpDir, 'non-existing.txt')
  await FileSystem.remove(testFile)
})

test('rename', async () => {
  const tmpDir = await getTmpDir()
  const oldPath = join(tmpDir, 'file-to-be-moved.txt')
  const newPath = join(tmpDir, 'file-has-been-moved.txt')
  await fs.promises.writeFile(oldPath, '')
  await FileSystem.rename(oldPath, newPath)
  expect(fs.existsSync(oldPath)).toBe(false)
  expect(fs.existsSync(newPath)).toBe(true)
})

test('rename - non existing old path', async () => {
  const tmpDir = await getTmpDir()
  const oldPath = join(tmpDir, 'non-existing.txt')
  const newPath = join(tmpDir, 'file-has-been-moved.txt')
  await expect(FileSystem.rename(oldPath, newPath)).rejects.toThrow(
    `Failed to rename "${oldPath}" to "${newPath}": ENOENT`
  )
})

test('rename - new path in non-existing nested directory', async () => {
  const tmpDir = await getTmpDir()
  const oldPath = join(tmpDir, 'file-to-be-moved.txt')
  const newPath = join(tmpDir, 'nested/nested/nested/file-has-been-moved.txt')
  await fs.promises.writeFile(oldPath, '')
  await expect(FileSystem.rename(oldPath, newPath)).rejects.toThrow(
    `Failed to rename "${oldPath}" to "${newPath}": ENOENT:`
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
