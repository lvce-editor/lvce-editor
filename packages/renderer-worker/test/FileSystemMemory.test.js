import * as FileSystemMemory from '../src/parts/FileSystem/FileSystemMemory.js'

beforeEach(() => {
  FileSystemMemory.state.files = Object.create(null)
})

test('readFile', () => {
  FileSystemMemory.state.files['/test/file.txt'] = {
    type: 'file',
    content: 'test content',
  }
  expect(FileSystemMemory.readFile('/test/file.txt')).toBe('test content')
})

test('writeFile', () => {
  FileSystemMemory.writeFile('/test/file.txt', 'test content')
  expect(FileSystemMemory.state.files).toEqual({
    '/': {
      type: 'directory',
      content: '',
    },
    '/test/': {
      type: 'directory',
      content: '',
    },
    '/test/file.txt': {
      content: 'test content',
      type: 'file',
    },
  })
})

test('readDirWithFileTypes - file', () => {
  FileSystemMemory.state.files = {
    '/': {
      type: 'directory',
      content: '',
    },
    '/test/': {
      type: 'directory',
      content: '',
    },
    '/test/file.txt': {
      content: 'test content',
      type: 'file',
    },
  }
  expect(FileSystemMemory.readDirWithFileTypes('/test')).toEqual([
    {
      name: 'file.txt',
      type: 'file',
    },
  ])
})

test('readDirWithFileTypes - directory', () => {
  FileSystemMemory.state.files = {
    '/': {
      type: 'directory',
      content: '',
    },
    '/test/': {
      type: 'directory',
      content: '',
    },
    '/test/file.txt': {
      content: 'test content',
      type: 'file',
    },
  }
  expect(FileSystemMemory.readDirWithFileTypes('/')).toEqual([
    {
      name: 'test',
      type: 'directory',
    },
  ])
})
