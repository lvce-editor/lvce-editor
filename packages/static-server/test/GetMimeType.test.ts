import { expect, test } from '@jest/globals'
import * as GetMimeType from '../src/parts/GetMimeType/GetMimeType.js'

test('jpeg', () => {
  expect(GetMimeType.getMimeType('.jpeg')).toBe('image/jpg')
})

test('avif', () => {
  expect(GetMimeType.getMimeType('.avif')).toBe('image/avif')
})
