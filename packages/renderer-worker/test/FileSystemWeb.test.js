import * as FileSystemWeb from '../src/parts/FileSystem/FileSystemWeb.js'

beforeEach(() => {
  FileSystemWeb.state.files = Object.create(null)
})

test('readFile', async () => {
  FileSystemWeb.state.files['/languages/index.dart'] = `void main() {
  print('Hello, World!');
}`
  expect(
    await FileSystemWeb.readFile('/workspace/languages/index.dart')
  ).toEqual(
    `void main() {
  print('Hello, World!');
}`
  )
})
test('readFile - error', async () => {
  await expect(
    FileSystemWeb.readFile('/languages/index.dart')
  ).rejects.toThrowError(new Error('file not found'))
})

test('rename', async () => {
  expect(
    FileSystemWeb.rename('/tmp/some-file.txt', '/tmp/renamed.txt')
  ).rejects.toThrowError(new Error('not implemented'))
})

test('getPathSeparator', () => {
  expect(FileSystemWeb.getPathSeparator()).toBe('/')
})

test('writeFile', async () => {
  await FileSystemWeb.writeFile('/workspace/file.txt', 'test')
  expect(FileSystemWeb.state.files).toEqual({ '/file.txt': 'test' })
})
