import * as TextSegmenter from '../src/parts/TextSegmenter/TextSegmenter.js'

test('visualIndex', () => {
  const segmenter = TextSegmenter.create()
  expect(segmenter.visualIndex('abc', 3)).toBe(3)
})

test('visualIndex - at start', () => {
  const segmenter = TextSegmenter.create()
  expect(segmenter.visualIndex('abc', 0)).toBe(0)
})

test('visualIndex - with emoji - 👮🏽‍♀️', () => {
  const segmenter = TextSegmenter.create()
  expect(segmenter.visualIndex('👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️', 21)).toBe(3)
})

test('modelIndex', () => {
  const segmenter = TextSegmenter.create()
  expect(segmenter.modelIndex('abc', 2)).toBe(2)
})

test('modelIndex - at start', () => {
  const segmenter = TextSegmenter.create()
  expect(segmenter.modelIndex('abc', 0)).toBe(0)
})

test('modelIndex - with emoji - 👮🏽‍♀️', () => {
  const segmenter = TextSegmenter.create()
  expect(segmenter.modelIndex('👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️', 3)).toBe(21)
})
