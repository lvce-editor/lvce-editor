import { beforeEach, expect, test } from '@jest/globals'
import * as FileSystemWeb from '../src/parts/FileSystem/FileSystemWeb.js'

beforeEach(() => {
  FileSystemWeb.state.files = Object.create(null)
})

test('readFile', async () => {
  FileSystemWeb.state.files['/languages/index.dart'] = `void main() {
  print('Hello, World!');
}`
  expect(await FileSystemWeb.readFile('/languages/index.dart')).toEqual(
    `void main() {
  print('Hello, World!');
}`,
  )
})
test('readFile - error', async () => {
  await expect(FileSystemWeb.readFile('/languages/index.dart')).rejects.toThrow(new Error('file not found /languages/index.dart'))
})

test('rename', async () => {
  expect(FileSystemWeb.rename('/tmp/some-file.txt', '/tmp/renamed.txt')).rejects.toThrow(new Error('not implemented'))
})

test('getPathSeparator', () => {
  expect(FileSystemWeb.getPathSeparator()).toBe('/')
})

test('writeFile', async () => {
  await FileSystemWeb.writeFile('/file.txt', 'test')
  expect(FileSystemWeb.state.files).toEqual({ '/file.txt': 'test' })
})
