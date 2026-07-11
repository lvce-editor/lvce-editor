import { expect, test } from '@jest/globals'
import { normalizePath } from './ImportScript.js'

test('normalizes a windows drive path with a leading slash', () => {
  expect(normalizePath('/D:/a/git/git/packages/node/src/gitClient.js', 'win32')).toBe('D:/a/git/git/packages/node/src/gitClient.js')
})

test('keeps a windows drive path without a leading slash', () => {
  expect(normalizePath('D:/a/git/git/packages/node/src/gitClient.js', 'win32')).toBe('D:/a/git/git/packages/node/src/gitClient.js')
})

test('keeps a posix path', () => {
  expect(normalizePath('/workspace/git/packages/node/src/gitClient.js', 'linux')).toBe('/workspace/git/packages/node/src/gitClient.js')
})
