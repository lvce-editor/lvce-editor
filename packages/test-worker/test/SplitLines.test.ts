import * as SplitLines from '../src/parts/SplitLines/SplitLines.ts'
import { test, expect } from '@jest/globals'

test('splitLines', () => {
  const lines = 'a\nb'
  expect(SplitLines.splitLines(lines)).toEqual(['a', 'b'])
})

test('empty string', () => {
  const lines = ''
  expect(SplitLines.splitLines(lines)).toEqual([])
})
