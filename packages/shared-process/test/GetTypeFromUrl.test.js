import { expect, test } from '@jest/globals'
import * as GetTypeFromUrl from '../src/parts/GetTypeFromUrl/GetTypeFromUrl.js'

test('error - missing url', () => {
  const url = undefined
  expect(() => GetTypeFromUrl.getTypeFromUrl(url)).toThrow(new Error('invalid url'))
})

test('error - missing query parameters', () => {
  const url = '/'
  expect(() => GetTypeFromUrl.getTypeFromUrl(url)).toThrow(new Error(`missing type parameter`))
})

test('valid query parameters', () => {
  const url = '/?type=shared-process'
  expect(GetTypeFromUrl.getTypeFromUrl(url)).toBe('shared-process')
})
