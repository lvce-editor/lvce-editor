import * as Diff from '../src/parts/Diff/Diff.js'

test.skip('deletion', () => {
  const linesA = ['a']
  const linesB = []
  const expected = [1, 1, 0, 0]
  expect(Diff.diff(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('insertion', () => {
  const linesA = []
  const linesB = ['a']
  const expected = [0, 0, 1, 1]
  expect(Diff.diff(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('two insertions', () => {
  const linesA = []
  const linesB = ['a', 'b']
  const expected = [0, 0, 1, 1]
  expect(Diff.diff(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('three insertions', () => {
  const linesA = []
  const linesB = ['a', 'b', 'c']
  const expected = [0, 0, 1, 1]
  expect(Diff.diff(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('insertion at start', () => {
  const linesA = ['b', 'c']
  const linesB = ['a', 'b', 'c']
  const expected = [0, 0, 1, 1]
  expect(Diff.diff(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('insertion at end', () => {
  const linesA = ['a', 'b']
  const linesB = ['a', 'b', 'c']
  const expected = [0, 0, 1, 1]
  expect(Diff.diff(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('insertion at start and end', () => {
  const linesA = ['c']
  const linesB = ['a', 'b', 'c', 'd']
  const expected = [0, 0, 1, 2, 1, 0, 4, 4]
  expect(Diff.diff(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('replacement', () => {
  const linesA = ['a']
  const linesB = ['b']
  const expected = [1, 1, 1, 1]
  expect(Diff.diff(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('word replacement', () => {
  const linesA = ['The', 'cat', 'in', 'the', 'hat']
  const linesB = ['The', 'dog', 'in', 'the', 'hat']
  const expected = [2, 2, 2, 2]
  expect(Diff.diff(linesA, linesB)).toEqual([new Uint32Array(expected)])
})

test.skip('word insertion', () => {
  const linesA = ['The', 'cat', 'in', 'the', 'hat']
  const linesB = ['The', 'furry', 'cat', 'in', 'the', 'hat']
  const expected = [1, 0, 2, 2]
  expect(Diff.diff(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('wordDeletion', () => {
  const linesA = ['The', 'cat', 'in', 'the', 'hat']
  const linesB = ['The', 'cat']
  const expected = [3, 5, 2, 0]
  expect(Diff.diff(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('two edits', () => {
  const linesA = ['The', 'cat', 'in', 'the', 'hat']
  const linesB = ['The', 'ox', 'in', 'the', 'box']
  const expected = [1, 1, 1, 1, 5, 5, 5, 5]
  expect(Diff.diff(linesA, linesB)).toEqual(new Uint32Array(expected))
})
