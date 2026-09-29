import { expect, jest, test } from '@jest/globals'
import * as GetMimeType from '../src/parts/GetMimeType/GetMimeType.js'

test('html', () => {
  expect(GetMimeType.getMimeType('.html')).toBe('text/html')
})

test('css', () => {
  expect(GetMimeType.getMimeType('.css')).toBe('text/css')
})

test('ttf', () => {
  expect(GetMimeType.getMimeType('.ttf')).toBe('font/ttf')
})

test.each([
  ['.apng', 'image/apng'],
  ['.avif', 'image/avif'],
  ['.bmp', 'image/bmp'],
  ['.gif', 'image/gif'],
  ['.heic', 'image/heic'],
  ['.HEIC', 'image/heic'],
  ['.heif', 'image/heif'],
  ['.HEIF', 'image/heif'],
  ['.ico', 'image/x-icon'],
  ['.jpe', 'image/jpg'],
  ['.jpeg', 'image/jpg'],
  ['.jfif', 'image/jpg'],
  ['.jpg', 'image/jpg'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.tif', 'image/tiff'],
  ['.tiff', 'image/tiff'],
  ['.webp', 'image/webp'],
])('media type %s', (extension, expected) => {
  expect(GetMimeType.getMimeType(extension)).toBe(expected)
})

test('json', () => {
  expect(GetMimeType.getMimeType('.json')).toBe('application/json')
})

test.each([
  ['.mp4', 'video/mp4'],
  ['.oga', 'audio/ogg'],
  ['.ogg', 'audio/ogg'],
  ['.ogv', 'video/ogg'],
  ['.opus', 'audio/ogg'],
  ['.wav', 'audio/wav'],
])('preview media type %s does not warn', (extension, expected) => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  try {
    expect(GetMimeType.getMimeType(extension)).toBe(expected)
    expect(GetMimeType.getMimeType(extension.toUpperCase())).toBe(expected)
    expect(warn).not.toHaveBeenCalled()
  } finally {
    warn.mockRestore()
  }
})
