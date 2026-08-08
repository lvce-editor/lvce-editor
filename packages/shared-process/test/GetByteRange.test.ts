import { expect, test } from '@jest/globals'
import * as GetByteRange from '../src/parts/GetByteRange/GetByteRange.ts'

test('parses a closed byte range', () => {
  expect(GetByteRange.getByteRange('bytes=2-5', 10)).toEqual({ end: 5, start: 2 })
})

test('parses an open-ended byte range', () => {
  expect(GetByteRange.getByteRange('bytes=6-', 10)).toEqual({ end: 9, start: 6 })
})

test('parses a suffix byte range', () => {
  expect(GetByteRange.getByteRange('bytes=-4', 10)).toEqual({ end: 9, start: 6 })
})

test('clamps the end to the file size', () => {
  expect(GetByteRange.getByteRange('bytes=8-20', 10)).toEqual({ end: 9, start: 8 })
})

test.each(['bytes=10-', 'bytes=5-2', 'bytes=-0', 'items=0-1', 'bytes=0-1,4-5'])('rejects an invalid range: %s', (range) => {
  expect(GetByteRange.getByteRange(range, 10)).toBeUndefined()
})
