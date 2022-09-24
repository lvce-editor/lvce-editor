import * as TextDocumentSearch from '../src/parts/TextDocumentSearch/TextDocumentSearch.js'

test('findMatches - no results', () => {
  expect(TextDocumentSearch.findMatches([], '')).toEqual(new Uint32Array([]))
})

test('findMatches - one result', () => {
  expect(TextDocumentSearch.findMatches(['line 1'], 'line')).toEqual(
    new Uint32Array([0, 0])
  )
})

test('findMatches - two results', () => {
  expect(
    TextDocumentSearch.findMatches(['line 1', 'not match', 'line 3'], 'line')
  ).toEqual(new Uint32Array([0, 0, 2, 0]))
})

test('findPreviousMatch', () => {
  expect(
    TextDocumentSearch.findPreviousMatch(['line 1', 'not match', 'line 3'], 2)
  ).toEqual({
    rowIndex: 0,
    columnIndex: 0,
  })
})
