import { expect, test } from '@jest/globals'
import * as GetMimeType from '../src/parts/GetMimeType/GetMimeType.js'

test('jpeg', () => {
  expect(GetMimeType.getMimeType('.jpeg')).toBe('image/jpg')
})

test('avif', () => {
  expect(GetMimeType.getMimeType('.avif')).toBe('image/avif')
})

test.each([
  ['unknown extension', '.unknown', 'application/octet-stream'],
  ['JavaScript', '.js', 'text/javascript'],
  ['HTML', '.html', 'text/html'],
  ['extensionless file', '', 'text/plain'],
])('returns the expected MIME type for %s', (_name, extension, expected) => {
  expect(GetMimeType.getMimeType(extension)).toBe(expected)
})
