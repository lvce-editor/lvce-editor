import { expect, test } from '@jest/globals'
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

test('png', () => {
  expect(GetMimeType.getMimeType('.png')).toBe('image/png')
})

test('json', () => {
  expect(GetMimeType.getMimeType('.json')).toBe('application/json')
})
