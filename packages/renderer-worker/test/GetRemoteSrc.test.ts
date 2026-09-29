import { expect, test } from '@jest/globals'
import * as GetRemoteSrc from '../src/parts/GetRemoteSrc/GetRemoteSrc.js'

test('preserves a memfs uri', () => {
  expect(GetRemoteSrc.getRemoteSrc('memfs:///workspace/image.svg')).toBe('memfs:///workspace/image.svg')
})

test('preserves an https uri', () => {
  expect(GetRemoteSrc.getRemoteSrc('https://example.com/image.svg')).toBe('https://example.com/image.svg')
})

test('converts a file uri to a remote source', () => {
  expect(GetRemoteSrc.getRemoteSrc('file:///tmp/image.svg')).toBe('/remote/tmp/image.svg')
})

test('converts an absolute path to a remote source', () => {
  expect(GetRemoteSrc.getRemoteSrc('/tmp/image.svg')).toBe('/remote/tmp/image.svg')
})

test('converts a relative path to a remote source', () => {
  expect(GetRemoteSrc.getRemoteSrc('tmp/image.svg')).toBe('/remote/tmp/image.svg')
})

test('converts a windows path to a remote source', () => {
  expect(GetRemoteSrc.getRemoteSrc('C:\\workspace\\image.svg')).toBe('/remote/C:/workspace/image.svg')
})
