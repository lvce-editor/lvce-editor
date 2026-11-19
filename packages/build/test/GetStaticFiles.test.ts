import { expect, test } from '@jest/globals'
import { generateFilesCodeMap } from '../src/parts/GetStaticFiles/GetStaticFiles.ts'

test('adds aliases for application routes to the static file map', () => {
  const files = generateFilesCodeMap(
    [0, 1, 2, 3, 4],
    ['/index.html', '/chat/index.html', '/board/index.html', '/auth/callback.html', '/boards/index.html'],
  )

  expect(files).toMatchObject({
    '/': 0,
    '/chat': 1,
    '/board': 2,
    '/boards': 4,
    '/auth/callback': 3,
  })
})
