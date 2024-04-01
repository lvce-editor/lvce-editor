import * as SplitLines from '../src/parts/SplitLines/SplitLines.ts'
import { test, expect } from '@jest/globals'

test('assetDir', () => {
  const lines = 'a\nb'
  expect(SplitLines.splitLines(lines)).toEqual(['a', 'b'])
})
