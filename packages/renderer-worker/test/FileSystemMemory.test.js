import * as FileSystemMemory from '../src/parts/FileSystem/FileSystemMemory.js'
import * as DirentType from '../src/parts/DirentType/DirentType.js'

beforeEach(() => {
  FileSystemMemory.state.files = Object.create(null)
})

test('readFile', () => {
  FileSystemMemory.state.files['/test/file.txt'] = {
    type: DirentType.File,
    content: 'test content',
  }
  expect(FileSystemMemory.readFile('/test/file.txt')).toBe('test content')
})

test('writeFile', () => {
  FileSystemMemory.writeFile('/test/file.txt', 'test content')
  expect(FileSystemMemory.state.files).toEqual({
    '/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test/file.txt': {
      content: 'test content',
      type: DirentType.File,
    },
  })
})

test('readDirWithFileTypes - file', () => {
  FileSystemMemory.state.files = {
    '/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test/file.txt': {
      content: 'test content',
      type: DirentType.File,
    },
  }
  expect(FileSystemMemory.readDirWithFileTypes('/test')).toEqual([
    {
      name: 'file.txt',
      type: DirentType.File,
    },
  ])
})

test('readDirWithFileTypes - directory', () => {
  FileSystemMemory.state.files = {
    '/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test/file.txt': {
      content: 'test content',
      type: DirentType.File,
    },
  }
  expect(FileSystemMemory.readDirWithFileTypes('/')).toEqual([
    {
      name: 'test',
      type: DirentType.Directory,
    },
  ])
})

test('readDirWithFileTypes - mixed content', () => {
  FileSystemMemory.state.files = {
    '/': {
      type: DirentType.Directory,
      content: '',
    },
    '/languages/': {
      type: DirentType.Directory,
      content: '',
    },
    '/sample-folder/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test.txt': {
      type: DirentType.File,
      content: 'div',
    },
    '/languages/index.html': {
      type: DirentType.File,
      content: 'div',
    },
    '/sample-folder/a.txt': {
      type: DirentType.File,
      content: '',
    },
    '/sample-folder/b.txt': {
      type: DirentType.File,
      content: '',
    },
    '/sample-folder/c.txt': {
      type: DirentType.File,
      content: '',
    },
  }
  expect(FileSystemMemory.readDirWithFileTypes('/')).toEqual([
    {
      name: 'languages',
      type: DirentType.Directory,
    },
    {
      name: 'sample-folder',
      type: DirentType.Directory,
    },
    {
      name: 'test.txt',
      type: DirentType.File,
    },
  ])
})

test('getPathSeparator', () => {
  expect(FileSystemMemory.getPathSeparator()).toBe('/')
})
