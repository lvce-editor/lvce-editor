import * as FileSystemWeb from '../src/parts/FileSystem/FileSystemWeb.js'

test('readFile', async () => {
  // TODO passing protocol here seems unnecessary, but it is useful for extension host which has several protocols
  expect(
    await FileSystemWeb.readFile('web:///workspace/languages/index.dart')
  ).toEqual(
    `void main() {
  print('Hello, World!');
}`
  )
})
test('readFile - error', async () => {
  // TODO passing protocol here seems unnecessary, but it is useful for extension host which has several protocols
  await expect(
    FileSystemWeb.readFile('web:///languages/index.dart')
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
