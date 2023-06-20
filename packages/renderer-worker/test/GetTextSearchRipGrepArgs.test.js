import * as GetTextSearchRipGrepArgs from '../src/parts/GetTextSearchRipGrepArgs/GetTextSearchRipGrepArgs.js'

test('getRipGrepArgs - threads', () => {
  expect(
    GetTextSearchRipGrepArgs.getRipGrepArgs({
      threads: 1,
      isCaseSensitive: false,
      searchString: 'test',
    })
  ).toEqual(['--smart-case', '--stats', '--json', '--threads', '1', '--ignore-case', '--fixed-strings', '--', 'test', '.'])
})

test('getRipGrepArgs - isCaseSensitive', () => {
  expect(
    GetTextSearchRipGrepArgs.getRipGrepArgs({
      threads: 1,
      isCaseSensitive: true,
      searchString: 'test',
    })
  ).toEqual(['--smart-case', '--stats', '--json', '--threads', '1', '--case-sensitive', '--fixed-strings', '--', 'test', '.'])
})
