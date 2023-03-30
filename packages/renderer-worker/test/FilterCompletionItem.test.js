import * as FilterCompletionItem from '../src/parts/FilterCompletionItem/FilterCompletionItem.js'

test('filterCompletionItem - match by word starts', () => {
  expect(FilterCompletionItem.filterCompletionItem('fd', 'font-display')).toEqual([expect.any(Number), 0, 1, 5, 6])
})

test('filterCompletionItem - match by word starts - one character in first match and two characters in second match', () => {
  expect(FilterCompletionItem.filterCompletionItem('fdi', 'font-display')).toEqual([expect.any(Number), 0, 1, 5, 7])
})

test('filterCompletionItem - match by word starts - one character in first match and three characters in second match', () => {
  expect(FilterCompletionItem.filterCompletionItem('fdis', 'font-display')).toEqual([expect.any(Number), 0, 1, 5, 8])
})

test('filterCompletionItem - match by word starts - three characters in second match', () => {
  expect(FilterCompletionItem.filterCompletionItem('wra', 'word-wrap')).toEqual([expect.any(Number), 5, 8])
})

test('filterCompletionItem - match by word starts - two characters in first match and two characters in second match', () => {
  expect(FilterCompletionItem.filterCompletionItem('fodi', 'font-display')).toEqual([expect.any(Number), 0, 2, 5, 7])
})

test('filterCompletionItem - match by word starts - two partial matches', () => {
  expect(FilterCompletionItem.filterCompletionItem('iem', 'items')).toEqual([expect.any(Number), 0, 1, 2, 4])
})

test('filterCompletionItem - three partial matches', () => {
  expect(FilterCompletionItem.filterCompletionItem('mode', 'mask-border')).toEqual([expect.any(Number), 0, 1, 6, 7, 8, 10])
})

test('filterCompletionItem - three partial matches #2', () => {
  expect(FilterCompletionItem.filterCompletionItem('core', 'controller')).toEqual([expect.any(Number), 0, 2, 4, 5, 8, 9])
})

test('filterCompletionItem - three camel case matches', () => {
  // TODO highlights are not good
  expect(FilterCompletionItem.filterCompletionItem('tololo', 'toLocalLowerCase')).toEqual([expect.any(Number), 0, 4, 6, 7, 8, 9])
})

test('filterCompletionItem - three characters match at start', () => {
  expect(FilterCompletionItem.filterCompletionItem('app', 'apply')).toEqual([expect.any(Number), 0, 3])
})

test('filterCompletionItem - font-variant-position', () => {
  expect(FilterCompletionItem.filterCompletionItem('font-posit', 'font-variant-position')).toEqual([expect.any(Number), 0, 5, 13, 18])
})

test('filterCompletionItem - background-size', () => {
  expect(FilterCompletionItem.filterCompletionItem('size', 'background-size')).toEqual([expect.any(Number), 11, 15])
})

test('filterCompletionItem - controller_core', () => {
  expect(FilterCompletionItem.filterCompletionItem('core', 'controller_core')).toEqual([expect.any(Number), 11, 15])
})

test('filterCompletionItem - font-size', () => {
  expect(FilterCompletionItem.filterCompletionItem('font', 'font-size')).toEqual([expect.any(Number), 0, 4])
})

test('filterCompletionItem - font-language-override', () => {
  // TODO
  expect(FilterCompletionItem.filterCompletionItem('font', 'font-language-override')).toEqual([expect.any(Number), 0, 4])
})

test('filterCompletionItem - font-feature-settings', () => {
  expect(FilterCompletionItem.filterCompletionItem('font', 'font-feature-settings')).toEqual([expect.any(Number), 0, 4])
})

test('filterCompletionItem - same text', () => {
  expect(FilterCompletionItem.filterCompletionItem('font', 'font')).toEqual([expect.any(Number), 0, 4])
})

test('filterCompletionItem - no match', () => {
  expect(FilterCompletionItem.filterCompletionItem('fd', 'height')).toEqual([])
})

test('filterCompletionItem - odd match', () => {
  expect(FilterCompletionItem.filterCompletionItem('font', 'justify-content')).toEqual([expect.any(Number), 5, 6, 9, 12])
})
