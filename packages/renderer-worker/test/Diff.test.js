import * as Diff from '../src/parts/Diff/Diff.js'

test.only('deletion', () => {
  const linesA = ['a']
  const linesB = []
  const expected = [
    /* originalStart */ 1 /******* */, /* originalEnd */ 1 /* */,
    /* modifiedStart */ 0, /* modifiedEnd */ 0,
  ]
  expect(Diff.diff(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test('insertion', () => {
  const stringA = ''
  const stringB = 'a'
  expect(Diff.diff(stringA, stringB)).toEqual(
    new Uint16Array([/* insertion */ 0, /* start */ 0, /* length */ 1])
  )
})

test('replacement', () => {
  const stringA = 'a'
  const stringB = 'b'
  expect(Diff.diff(stringA, stringB)).toEqual([])
})

test('word replacement', () => {
  const stringA = 'The cat in the hat.'
  const stringB = 'The dog in the hat.'
  expect(Diff.diff(stringA, stringB)).toEqual([
    /* change */
  ])
})

test('word insertion', () => {
  const stringA = 'The cat in the hat.'
  const stringB = 'The furry cat in the hat.'
  expect(Diff.diff(stringA, stringB)).toEqual([])
})

test('wordDeletion', () => {
  const stringA = 'The cat in the hat.'
  const stringB = 'The cat.'
  expect(Diff.diff(stringA, stringB)).toEqual([])
})

test('two edits', () => {
  const stringA = 'The cat in the hat.'
  const stringB = 'The ox in the box.'
  expect(Diff.diff(stringA, stringB)).toEqual([])
})
