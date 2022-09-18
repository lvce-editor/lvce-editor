import * as Mime from '../src/parts/Mime/Mime.js'

test('getMimeType - svg', () => {
  expect(Mime.getMimeType('/test/file.svg')).toBe('image/svg+xml')
})
