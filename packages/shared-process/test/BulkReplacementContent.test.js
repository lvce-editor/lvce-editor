import * as BulkReplacementContent from '../src/parts/BulkReplacementContent/BulkReplacementContent.js'

test('getNewContent - no ranges', () => {
  const content = 'a'
  const ranges = []
  const replacement = 'b'
  expect(BulkReplacementContent.getNewContent(content, ranges, replacement)).toBe('a')
})

test('getNewContent - single edit', () => {
  const content = 'a'
  const ranges = [0, 0, 0, 1]
  const replacement = 'b'
  expect(BulkReplacementContent.getNewContent(content, ranges, replacement)).toBe('b')
})

test('getNewContent - multiple edits in single file', () => {
  const content = `a
a`
  const ranges = [0, 0, 0, 1, 1, 0, 1, 1]
  const replacement = 'b'
  expect(BulkReplacementContent.getNewContent(content, ranges, replacement)).toBe(`b
b`)
})

test('getNewContent - multiple edits in one line', () => {
  const content = `aa`
  const ranges = [0, 0, 0, 1, 0, 1, 0, 2]
  const replacement = 'b'
  expect(BulkReplacementContent.getNewContent(content, ranges, replacement)).toBe(`bb`)
})
