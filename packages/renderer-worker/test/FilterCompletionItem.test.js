// based on tests from https://github.com/jeancroy/fuzz-aldrin-plus/blob/84eac1d73bacbbd11978e6960f4aa89f8396c540/spec/match-spec.coffee by jeancroy (License MIT)

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

test('filterCompletionItem - two empty strings', () => {
  expect(FilterCompletionItem.filterCompletionItem('', '')).toEqual([])
})

test('filterCompletionItem - word start 2', () => {
  expect(FilterCompletionItem.filterCompletionItem('he', 'Hello World')).toEqual([expect.any(Number), 0, 2])
})

test('filterCompletionItem - last character', () => {
  expect(FilterCompletionItem.filterCompletionItem('d', 'Hello World')).toEqual([expect.any(Number), 10, 11])
})

test('prefer whole word to scattered letters 1', () => {
  expect(FilterCompletionItem.filterCompletionItem('file', 'fiddle gruntfile file')).toEqual([expect.any(Number), 17, 21])
})

test('prefer whole word to scattered letters 2', () => {
  expect(FilterCompletionItem.filterCompletionItem('file', 'fiddle file')).toEqual([expect.any(Number), 7, 11])
})

test('prefer whole word to scattered letters 3', () => {
  expect(FilterCompletionItem.filterCompletionItem('file', 'find le file')).toEqual([expect.any(Number), 8, 12])
})

test('prefer whole word to scattered letters, even without exact matches 1', () => {
  expect(FilterCompletionItem.filterCompletionItem('filex', 'fiddle gruntfile xfiller')).toEqual([expect.any(Number), 12, 16, 17, 18])
})

test('prefer whole word to scattered letters, even without exact matches 2', () => {
  expect(FilterCompletionItem.filterCompletionItem('filex', 'fiddle file xfiller')).toEqual([expect.any(Number), 7, 11, 12, 13])
})

test('prefer whole word to scattered letters, even without exact matches 3', () => {
  expect(FilterCompletionItem.filterCompletionItem('filex', 'fine le file xfiller')).toEqual([expect.any(Number), 8, 12, 13, 14])
})

test('prefer exact match', () => {
  expect(FilterCompletionItem.filterCompletionItem('file', 'filter gruntfile filler')).toEqual([expect.any(Number), 12, 16])
})

test('prefer camelCase to scattered letters', () => {
  expect(FilterCompletionItem.filterCompletionItem('itc', 'ImportanceTableCtrl')).toEqual([expect.any(Number), 0, 1, 10, 11, 15, 16])
})

test('prefer acronym to scattered letters 1', () => {
  // TODO
  expect(FilterCompletionItem.filterCompletionItem('acon', 'action_config')).toEqual([expect.any(Number), 0, 2, 8, 10])
})

test('prefer acronym to scattered letters 2', () => {
  expect(FilterCompletionItem.filterCompletionItem('acon', 'application_control')).toEqual([expect.any(Number), 0, 1, 12, 15])
})

test('filterCompletionItem - middle', () => {
  expect(FilterCompletionItem.filterCompletionItem('elwor', 'Hello World')).toEqual([expect.any(Number), 1, 3, 6, 9])
})

test('filterCompletionItem - three partial matches', () => {
  expect(FilterCompletionItem.filterCompletionItem('mode', 'mask-border')).toEqual([expect.any(Number), 0, 1, 6, 7, 8, 10])
})

test('filterCompletionItem - three partial matches #2', () => {
  expect(FilterCompletionItem.filterCompletionItem('core', 'controller')).toEqual([expect.any(Number), 0, 2, 4, 5, 8, 9])
})

test('filterCompletionItem - three camel case matches', () => {
  expect(FilterCompletionItem.filterCompletionItem('tololo', 'toLocalLowerCase')).toEqual([expect.any(Number), 0, 4, 7, 9])
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

test('filterCompletionItem - match by three word starts', () => {
  expect(FilterCompletionItem.filterCompletionItem('ffs', 'font-feature-settings')).toEqual([expect.any(Number), 0, 1, 5, 6, 13, 14])
})

test('filterCompletionItem - match by first word and two word starts', () => {
  expect(FilterCompletionItem.filterCompletionItem('font-fs', 'font-feature-settings')).toEqual([expect.any(Number), 0, 6, 13, 14])
})

test('vscode - Unexpected suggestion scoring, #28791', () => {
  // TODO
  expect(FilterCompletionItem.filterCompletionItem('_lines', '_lineStarts')).toEqual([expect.any(Number), 0, 5, 10, 11])
})

test('vscode - fuzzyScore - ab - abA', () => {
  expect(FilterCompletionItem.filterCompletionItem('ab', 'abA')).toEqual([expect.any(Number), 0, 2])
})

test('vscode - fuzzyScore - ccm - cacmelCase', () => {
  expect(FilterCompletionItem.filterCompletionItem('ccm', 'cacmelCase')).toEqual([expect.any(Number), 0, 1, 2, 4])
})

test('vscode - fuzzyScore - bti - the_black_knight', () => {
  expect(FilterCompletionItem.filterCompletionItem('bti', 'the_black_knight')).toEqual([])
})

test('vscode - fuzzyScore - ccm - camelCase', () => {
  expect(FilterCompletionItem.filterCompletionItem('ccm', 'camelCase')).toEqual([])
})

test('vscode - fuzzyScore - cmcm - camelCase', () => {
  expect(FilterCompletionItem.filterCompletionItem('cmcm', 'camelCase')).toEqual([])
})

test('vscode - fuzzyScore - BK - the_black_knight', () => {
  // TODO
  expect(FilterCompletionItem.filterCompletionItem('BK', 'the_black_knight')).toEqual([expect.any(Number)])
})

test('vscode - fuzzyScore - KeyboardLayout= - KeyboardLayout', () => {
  // TODO
  expect(FilterCompletionItem.filterCompletionItem('KeyboardLayout=', 'KeyboardLayout')).toEqual([])
})

test('vscode - fuzzyScore - LLL - SVisualLoggerLogsList', () => {
  expect(FilterCompletionItem.filterCompletionItem('LLL', 'SVisualLoggerLogsList')).toEqual([expect.any(Number), 7, 8, 13, 14, 17, 18])
})

test.skip('vscode - fuzzyScore - LLLL - SVilLoLosLi', () => {
  expect(FilterCompletionItem.filterCompletionItem('LLLL', 'SVilLoLosLi')).toEqual([])
})

test('vscode - fuzzyScore - LLLL - SVisualLoggerLogsList', () => {
  expect(FilterCompletionItem.filterCompletionItem('LLLL', 'SVisualLoggerLogsList')).toEqual([expect.any(Number), 7, 8, 13, 14, 17, 19])
})

test('vscode - fuzzyScore - TEdit - TextEdit', () => {
  expect(FilterCompletionItem.filterCompletionItem('TEdit', 'TextEdit')).toEqual([expect.any(Number), 0, 1, 4, 8])
})

test('vscode - fuzzyScore - TEdit - TextEditor', () => {
  expect(FilterCompletionItem.filterCompletionItem('TEdit', 'TextEditor')).toEqual([expect.any(Number), 0, 1, 4, 8])
})

test('vscode - fuzzyScore - TEdit - Textedit', () => {
  // TODO
  expect(FilterCompletionItem.filterCompletionItem('TEdit', 'Textedit')).toEqual([expect.any(Number), 0, 2, 5, 8])
})

test('vscode - fuzzyScore - TEdit - text_edit', () => {
  expect(FilterCompletionItem.filterCompletionItem('TEdit', 'text_edit')).toEqual([expect.any(Number), 6, 9])
})

test('vscode - fuzzyScore - bkn - the_black_knight', () => {
  expect(FilterCompletionItem.filterCompletionItem('bkn', 'the_black_knight')).toEqual([expect.any(Number), 4, 5, 10, 12])
})

test('vscode - fuzzyScore - bt - the_black_knight', () => {
  expect(FilterCompletionItem.filterCompletionItem('bt', 'the_black_knight')).toEqual([expect.any(Number), 4, 5, 15, 16])
})

test('vscode - fuzzyScore - fdm - findModel', () => {
  expect(FilterCompletionItem.filterCompletionItem('fdm', 'findModel')).toEqual([expect.any(Number), 0, 1, 6, 8])
})

test('vscode - fuzzyScore - fob - foobar', () => {
  expect(FilterCompletionItem.filterCompletionItem('fob', 'foobar')).toEqual([expect.any(Number), 0, 2, 3, 4])
})

test('vscode - fuzzyScore - form - editor.formatOnSave', () => {
  expect(FilterCompletionItem.filterCompletionItem('form', 'editor.formatOnSave')).toEqual([expect.any(Number), 7, 11])
})

test('vscode - fuzzyScore - is - ImportStatement', () => {
  // TODO
  expect(FilterCompletionItem.filterCompletionItem('is', 'ImportStatement')).toEqual([expect.any(Number)])
})
