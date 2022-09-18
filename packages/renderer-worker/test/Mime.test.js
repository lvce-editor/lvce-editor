import * as Mime from '../src/parts/Mime/Mime.js'

test('getMediaMimeType - svg', () => {
  expect(Mime.getMediaMimeType('/test/file.svg')).toBe('image/svg+xml')
})

test('getMediaMimeType - png', () => {
  expect(Mime.getMediaMimeType('/test/file.png')).toBe('image/png')
})

test('getMediaMimeType - jpg', () => {
  expect(Mime.getMediaMimeType('/test/file.jpg')).toBe('image/jpg')
})

test('getMediaMimeType - avif', () => {
  expect(Mime.getMediaMimeType('/test/file.avif')).toBe('image/avif')
})

test('getMediaMimeType - webp', () => {
  expect(Mime.getMediaMimeType('/test/file.webp')).toBe('image/webp')
})

test('getMediaMimeType - x-icon', () => {
  expect(Mime.getMediaMimeType('/test/file.ico')).toBe('image/x-icon')
})
