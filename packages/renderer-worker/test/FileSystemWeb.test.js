import * as FileSystemWeb from '../src/parts/FileSystem/FileSystemWeb.js'

test('readFile', async () => {
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
