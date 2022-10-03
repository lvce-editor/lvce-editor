import * as TextDocumentSearch from '../src/parts/TextDocumentSearch/TextDocumentSearch.js'

test('findMatches - no results', () => {
  expect(TextDocumentSearch.findMatches([], '')).toEqual(new Uint32Array([]))
})

test('findMatches - one result', () => {
  expect(TextDocumentSearch.findMatches(['line 1'], 'line')).toEqual(
    new Uint32Array([0, 0])
  )
})

test('findMatches - two results in two rows', () => {
  expect(
    TextDocumentSearch.findMatches(['line 1', 'not match', 'line 3'], 'line')
  ).toEqual(new Uint32Array([0, 0, 2, 0]))
})

test('findMatches - two results in one row', () => {
  expect(TextDocumentSearch.findMatches(['line 1 line 2'], 'line')).toEqual(
    new Uint32Array([0, 0, 0, 7])
  )
})

test('findPreviousMatch', () => {
  expect(
    TextDocumentSearch.findPreviousMatch(['line 1', 'not match', 'line 3'], 2)
  ).toEqual({
    rowIndex: 0,
    columnIndex: 0,
  })
})
